import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TENANT_ID = "a1b2c3d4-0001-0001-0001-000000000001";
const NOTIFY_EMAIL = "PierreSr@OttawaDrivewayExperts.com";
const TEAM_NOTIFY_TO = "dawn@ottawadrivewayexperts.com, admin@ottawadrivewayexperts.com";
const DEFAULT_CITY = "Ottawa";
const DEFAULT_PROVINCE = "Ontario";
const DEFAULT_TAGS = ["Residential"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const body = await req.json();
    const {
      name,
      phone, // legacy alias used by older form payloads
      cell,
      spousePhone,
      workPhone,
      email,
      houseNumber,
      street,
      postalCode,
      address: providedAddress,
      service,
      message,
      contactTime,
      contactDays,
    } = body ?? {};

    const cellValue = String(cell || phone || "").trim();
    const spousePhoneValue = String(spousePhone || "").trim();
    const workPhoneValue = String(workPhone || "").trim();
    const houseNumberValue = String(houseNumber || "").trim();
    const streetValue = String(street || "").trim();
    const postalCodeValue = String(postalCode || "").trim().toUpperCase();
    const contactTimeValue = String(contactTime || "").trim();
    const contactDaysValue: string[] = Array.isArray(contactDays)
      ? contactDays.filter((d) => typeof d === "string" && d.trim() !== "")
      : [];

    if (!name || !cellValue) {
      return new Response(JSON.stringify({ error: "name and phone are required" }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const streetAddress = providedAddress
      ? String(providedAddress).trim()
      : [houseNumberValue, streetValue].filter(Boolean).join(" ").trim();

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // Cross-function call helper. send-email has verify_jwt:true which rejects
    // service-role JWTs from edge-to-edge calls. Anon key is also a valid
    // project JWT and is accepted by verify_jwt:true. Pass apikey header too.
    const callFunction = (slug: string, payload: unknown) =>
      fetch(`${SUPABASE_URL}/functions/v1/${slug}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ANON_KEY}`,
          apikey: ANON_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

    const nameParts = String(name).trim().split(/\s+/);
    const first_name = nameParts[0] ?? "";
    const last_name = nameParts.slice(1).join(" ") || "";

    const daysStr = contactDaysValue.length > 0 ? contactDaysValue.join(", ") : "";
    const fullAddressWithPostal = [streetAddress, postalCodeValue].filter(Boolean).join(", ");
    const bookingAddress = streetAddress ? `${streetAddress}, ${DEFAULT_CITY}` : null;
    const preferredWindow = [contactTimeValue, daysStr].filter(Boolean).join(" · ");

    // Structured note block stored on the client record
    const clientNoteLines: string[] = [];
    if (service) clientNoteLines.push(`Service: ${service}`);
    if (fullAddressWithPostal) clientNoteLines.push(`Address: ${fullAddressWithPostal}`);
    if (spousePhoneValue) clientNoteLines.push(`Spouse phone: ${spousePhoneValue}`);
    if (workPhoneValue) clientNoteLines.push(`Work phone: ${workPhoneValue}`);
    if (contactTimeValue) clientNoteLines.push(`Best time: ${contactTimeValue}`);
    if (daysStr) clientNoteLines.push(`Best days: ${daysStr}`);
    if (message) {
      clientNoteLines.push("");
      clientNoteLines.push("Details:");
      clientNoteLines.push(String(message));
    }
    const combinedNotes = clientNoteLines.join("\n").trim();

    // ---- Dedupe by email, then by trailing-digit phone match ----
    let existingClient: Record<string, unknown> | null = null;
    const normalisePhone = (p: string) => p.replace(/\D/g, "").slice(-10);
    const normPhone = normalisePhone(cellValue);

    if (email) {
      const { data } = await supabase
        .from("clients")
        .select("id, first_name, last_name")
        .eq("tenant_id", TENANT_ID)
        .ilike("email", String(email).trim())
        .limit(1)
        .maybeSingle();
      if (data) existingClient = data;
    }

    if (!existingClient && normPhone.length >= 7) {
      const { data: all } = await supabase
        .from("clients")
        .select("id, first_name, last_name, phone")
        .eq("tenant_id", TENANT_ID)
        .not("phone", "is", null);
      const match = (all || []).find(
        (c) => normalisePhone(c.phone || "").slice(-normPhone.length) === normPhone
      );
      if (match) existingClient = match;
    }

    let clientId: string;
    let isNewClient = false;

    if (existingClient) {
      clientId = existingClient.id as string;
      const appendNote = `--- New Website Request (${new Date().toLocaleDateString("en-CA")}) ---\n${combinedNotes}`;

      const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (cellValue) updates.cell = cellValue;
      if (spousePhoneValue) updates.spouse_phone = spousePhoneValue;
      if (workPhoneValue) updates.work_phone = workPhoneValue;
      if (houseNumberValue) updates.house_number = houseNumberValue;
      if (streetValue) updates.street = streetValue;
      if (postalCodeValue) updates.postal_code = postalCodeValue;
      if (streetAddress) updates.address = streetAddress;
      if (contactTimeValue) updates.contact_time = contactTimeValue;
      if (contactDaysValue.length > 0) updates.contact_days = contactDaysValue;
      await supabase.from("clients").update(updates).eq("id", clientId);

      // supabase.rpc() returns a builder (no .catch). Inspect { error } instead.
      const { error: rpcErr } = await supabase
        .rpc("append_client_note", { p_client_id: clientId, p_note: appendNote });
      if (rpcErr) {
        const { data: cur } = await supabase
          .from("clients")
          .select("notes")
          .eq("id", clientId)
          .single();
        const newNotes = [cur?.notes, appendNote].filter(Boolean).join("\n\n");
        await supabase.from("clients").update({ notes: newNotes }).eq("id", clientId);
      }
    } else {
      isNewClient = true;
      const baseInsert: Record<string, unknown> = {
        tenant_id: TENANT_ID,
        first_name,
        last_name,
        phone: cellValue,
        cell: cellValue,
        spouse_phone: spousePhoneValue || null,
        work_phone: workPhoneValue || null,
        email: email ?? "",
        address: streetAddress || null,
        house_number: houseNumberValue || null,
        street: streetValue || null,
        postal_code: postalCodeValue || null,
        contact_time: contactTimeValue || null,
        contact_days: contactDaysValue.length > 0 ? contactDaysValue : null,
        service_requested: service ?? "",
        notes: combinedNotes,
        tags: DEFAULT_TAGS,
        source: "website_form",
        lead_source: "Website",
        status: "lead",
      };

      let insertData: Record<string, unknown> | null = null;
      let insertError: { message?: string } | null = null;

      ({ data: insertData, error: insertError } = await supabase
        .from("clients")
        .insert(baseInsert)
        .select()
        .single());

      if (insertError) {
        const fallback: Record<string, unknown> = {
          tenant_id: TENANT_ID,
          first_name,
          last_name,
          phone: cellValue,
          email: email ?? "",
          notes: combinedNotes,
          tags: DEFAULT_TAGS,
          lead_source: "Website",
        };
        ({ data: insertData, error: insertError } = await supabase
          .from("clients")
          .insert(fallback)
          .select()
          .single());
      }

      if (insertError) throw insertError;
      clientId = (insertData as Record<string, string>).id;

      if (streetAddress || postalCodeValue) {
        await supabase
          .from("client_addresses")
          .insert({
            tenant_id: TENANT_ID,
            client_id: clientId,
            label: "Primary",
            address_line1: streetAddress || "",
            city: DEFAULT_CITY,
            province: DEFAULT_PROVINCE,
            postal_code: postalCodeValue || null,
            is_primary: true,
          })
          .then(({ error: addrErr }) => {
            if (addrErr) console.error("client_addresses insert failed (non-fatal):", addrErr);
          });
      }

      callFunction("create-stripe-customer", { clientId }).catch(() => {});
    }

    // ---- Auto-create a booking entry so this lead appears on Pierre's Schedule ----
    // Booking fields map to the New Booking form Pierre uses manually:
    //   client_name = full name        phone = cell        address = "<#> <Street>, Ottawa"
    //   service = service              booking_date = NULL (Pierre will schedule)
    //   booking_time = NULL            notes = structured block of unmapped form fields
    const bookingNoteLines: string[] = ["Source: Website Form"];
    if (email) bookingNoteLines.push(`Email: ${email}`);
    if (postalCodeValue) bookingNoteLines.push(`Postal Code: ${postalCodeValue}`);
    if (spousePhoneValue) bookingNoteLines.push(`Spouse Phone: ${spousePhoneValue}`);
    if (workPhoneValue) bookingNoteLines.push(`Work Phone: ${workPhoneValue}`);
    if (contactTimeValue) bookingNoteLines.push(`Best Time to Contact: ${contactTimeValue}`);
    if (daysStr) bookingNoteLines.push(`Best Days Available: ${daysStr}`);
    if (message) bookingNoteLines.push(`Project Details: ${String(message)}`);
    const bookingNotes = bookingNoteLines.join("\n");

    await supabase
      .from("bookings")
      .insert({
        tenant_id: TENANT_ID,
        client_id: clientId,
        client_name: String(name),
        phone: cellValue,
        email: email ?? null,
        address: bookingAddress,
        service: service ?? null,
        notes: bookingNotes,
        booking_date: null,
        booking_time: null,
        preferred_window: preferredWindow || null,
        status: "pending",
        source: "website_form",
      })
      .then(({ error: bookErr }) => {
        if (bookErr) console.error("bookings insert failed (non-fatal):", bookErr);
      });

    // ---- Email #1 — Pierre (existing) ----
    const pierreSubject = `New quote request: ${name} — ${service ?? "Unknown service"}`;
    const pierreBodyLines: string[] = [
      `Name: ${name}`,
      `Cell: ${cellValue}`,
      ...(spousePhoneValue ? [`Spouse phone: ${spousePhoneValue}`] : []),
      ...(workPhoneValue ? [`Work phone: ${workPhoneValue}`] : []),
      `Email: ${email ?? "—"}`,
      `Service: ${service ?? "—"}`,
      `Address: ${fullAddressWithPostal || "—"}`,
      ...(contactTimeValue ? [`Best time to contact: ${contactTimeValue}`] : []),
      ...(daysStr ? [`Best day(s): ${daysStr}`] : []),
      "",
      existingClient ? `⚠️ Matched existing client (ID: ${clientId})` : "New client created.",
      ...(message ? ["", "Details:", String(message)] : []),
    ];
    const pierreBody = pierreBodyLines.join("\n").trim();

    try {
      const r = await callFunction("send-email", {
        to: NOTIFY_EMAIL, subject: pierreSubject, body: pierreBody, tenant_id: TENANT_ID,
      });
      if (!r.ok) {
        const txt = await r.text();
        console.error("Pierre notification failed:", r.status, txt);
      }
    } catch (err) {
      console.error("Pierre notification threw:", err);
    }

    // ---- Email #2 — Dawn + Admin (new) ----
    const teamSubject = `New Website Quote Request — ${name} (${service ?? "Unknown service"})`;
    const teamBody = [
      "A new quote request has been submitted on ottawadrivewayexperts.com.",
      "",
      `Name: ${name}`,
      `Cell: ${cellValue}`,
      `Email: ${email ?? "—"}`,
      `Address: ${fullAddressWithPostal || "—"}`,
      `Service: ${service ?? "—"}`,
      "",
      "Contact Preference:",
      `- Best time: ${contactTimeValue || "—"}`,
      `- Best days: ${daysStr || "—"}`,
      "",
      "Project Details:",
      String(message || "—"),
      "",
      "This lead has been added to Pierre CRM automatically.",
    ].join("\n");

    try {
      const r = await callFunction("send-email", {
        to: TEAM_NOTIFY_TO, subject: teamSubject, body: teamBody, tenant_id: TENANT_ID,
      });
      if (!r.ok) {
        const txt = await r.text();
        console.error("Dawn/Admin notification failed:", r.status, txt);
      }
    } catch (err) {
      console.error("Dawn/Admin notification threw:", err);
    }

    return new Response(
      JSON.stringify({ ok: true, client_id: clientId, is_new_client: isNewClient }),
      { headers: { ...CORS, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("handle-quote-submission error:", err);
    const msg = (err as Record<string, string>)?.message || JSON.stringify(err) || "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
