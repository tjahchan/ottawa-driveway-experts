import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TENANT_ID = "a1b2c3d4-0001-0001-0001-000000000001";
const NOTIFY_EMAIL = "PierreSr@OttawaDrivewayExperts.com";
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

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const nameParts = String(name).trim().split(/\s+/);
    const first_name = nameParts[0] ?? "";
    const last_name = nameParts.slice(1).join(" ") || "";

    const daysStr = contactDaysValue.length > 0 ? contactDaysValue.join(", ") : "";
    const fullAddress = [streetAddress, postalCodeValue].filter(Boolean).join(", ");
    const preferredWindow = [contactTimeValue, daysStr].filter(Boolean).join(" · ");

    // Structured note block stored on the client record
    const noteLines: string[] = [];
    if (service) noteLines.push(`Service: ${service}`);
    if (fullAddress) noteLines.push(`Address: ${fullAddress}`);
    if (spousePhoneValue) noteLines.push(`Spouse phone: ${spousePhoneValue}`);
    if (workPhoneValue) noteLines.push(`Work phone: ${workPhoneValue}`);
    if (contactTimeValue) noteLines.push(`Best time: ${contactTimeValue}`);
    if (daysStr) noteLines.push(`Best days: ${daysStr}`);
    if (message) {
      noteLines.push("");
      noteLines.push("Details:");
      noteLines.push(String(message));
    }
    const combinedNotes = noteLines.join("\n").trim();

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

      await supabase
        .rpc("append_client_note", { p_client_id: clientId, p_note: appendNote })
        .catch(async () => {
          const { data: cur } = await supabase
            .from("clients")
            .select("notes")
            .eq("id", clientId)
            .single();
          const newNotes = [cur?.notes, appendNote].filter(Boolean).join("\n\n");
          await supabase.from("clients").update({ notes: newNotes }).eq("id", clientId);
        });
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

      // Fallback: if any column is unknown, retry with a minimal payload
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

      // Insert primary address into client_addresses so the CRM displays it
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

      // Sync to Stripe in background
      supabase.functions
        .invoke("create-stripe-customer", { body: { clientId } })
        .catch(() => {});
    }

    // ---- Auto-create a booking entry so this lead appears on Pierre's Schedule ----
    // Both new and existing-client website submissions get a booking card.
    // booking_date is left NULL (unscheduled) — Pierre fills it in.
    const bookingNoteLines: string[] = [];
    if (service) bookingNoteLines.push(`Service: ${service}`);
    if (spousePhoneValue) bookingNoteLines.push(`Spouse: ${spousePhoneValue}`);
    if (workPhoneValue) bookingNoteLines.push(`Work: ${workPhoneValue}`);
    if (message) {
      bookingNoteLines.push("");
      bookingNoteLines.push(String(message));
    }
    const bookingNotes = bookingNoteLines.join("\n").trim();

    await supabase
      .from("bookings")
      .insert({
        tenant_id: TENANT_ID,
        client_id: clientId,
        client_name: String(name),
        phone: cellValue,
        email: email ?? null,
        address: fullAddress || null,
        service: service ?? null,
        notes: bookingNotes || null,
        booking_date: null,
        booking_time: null,
        preferred_window: preferredWindow || null,
        status: "pending",
        source: "website_form",
      })
      .then(({ error: bookErr }) => {
        if (bookErr) console.error("bookings insert failed (non-fatal):", bookErr);
      });

    // ---- Build email notification to Pierre ----
    const subject = `New quote request: ${name} — ${service ?? "Unknown service"}`;
    const bodyLines: string[] = [
      `Name: ${name}`,
      `Cell: ${cellValue}`,
      ...(spousePhoneValue ? [`Spouse phone: ${spousePhoneValue}`] : []),
      ...(workPhoneValue ? [`Work phone: ${workPhoneValue}`] : []),
      `Email: ${email ?? "—"}`,
      `Service: ${service ?? "—"}`,
      `Address: ${fullAddress || "—"}`,
      ...(contactTimeValue ? [`Best time to contact: ${contactTimeValue}`] : []),
      ...(daysStr ? [`Best day(s): ${daysStr}`] : []),
      "",
      existingClient ? `⚠️ Matched existing client (ID: ${clientId})` : "New client created.",
      ...(message ? ["", "Details:", String(message)] : []),
    ];
    const emailBody = bodyLines.join("\n").trim();

    await supabase.functions.invoke("send-email", {
      body: { to: NOTIFY_EMAIL, subject, body: emailBody, tenant_id: TENANT_ID },
    });

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
