import { useState, type FormEvent } from "react";
import { Phone, Mail, MapPin, Send, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { toast } from "sonner";
import { z } from "zod";

const DRAFT_KEY = "quote_form_draft";

const POSTAL_REGEX = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  cell: z.string().trim().min(7, "Cell number is required").max(30),
  spousePhone: z.string().trim().max(30).optional().or(z.literal("")),
  workPhone: z.string().trim().max(30).optional().or(z.literal("")),
  email: z.string().trim().email("Valid email required").max(255),
  houseNumber: z.string().trim().min(1, "House # is required").max(20),
  street: z.string().trim().min(1, "Street name is required").max(200),
  postalCode: z.string().trim().regex(POSTAL_REGEX, "Format: K2T 1C1"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  contactTime: z.enum(["", "Morning", "Afternoon", "Evening"]).optional(),
  contactDays: z.array(z.string()).optional(),
});

const services = [
  "Asphalt Driveway Paving",
  "Driveway Sealing & Coating",
  "Interlock & Pavers",
  "Repairs & Resurfacing",
  "Crack Filling & Patching",
  "Asphalt Cutouts/Overlays & Patching",
  "Asphalt Lips/Ramps",
  "Concrete Services",
  "Aggregates Supply",
  "Line Painting & Symbols",
  "Other / Not Sure",
];

const TIMES = ["Morning", "Afternoon", "Evening"] as const;
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

const EDGE_FN_URL = "https://gorhemjqclfqedohjgtw.supabase.co/functions/v1/handle-quote-submission";

type ContactTime = "" | "Morning" | "Afternoon" | "Evening";

type Draft = {
  name: string;
  cell: string;
  spousePhone: string;
  workPhone: string;
  email: string;
  houseNumber: string;
  street: string;
  postalCode: string;
  service: string;
  message: string;
  contactTime: ContactTime;
  contactDays: string[];
};

const initialFormState: Draft = {
  name: "",
  cell: "",
  spousePhone: "",
  workPhone: "",
  email: "",
  houseNumber: "",
  street: "",
  postalCode: "",
  service: "",
  message: "",
  contactTime: "",
  contactDays: [],
};

const loadDraft = (): Draft => {
  try {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (!saved) return initialFormState;
    const parsed = JSON.parse(saved) as Partial<Draft> & { phone?: string };
    return {
      ...initialFormState,
      ...parsed,
      // Migrate prior draft: phone -> cell
      cell: parsed.cell || parsed.phone || "",
      contactDays: Array.isArray(parsed.contactDays) ? parsed.contactDays : [],
    };
  } catch {
    return initialFormState;
  }
};

const formatPostal = (raw: string) => {
  const clean = raw.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 6);
  return clean.length <= 3 ? clean : `${clean.slice(0, 3)} ${clean.slice(3)}`;
};

export const QuoteSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showExtraPhones, setShowExtraPhones] = useState(false);
  const [form, setForm] = useState<Draft>(loadDraft);

  const persistDraft = (next: Draft) => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const resetForm = () => {
    setForm(initialFormState);
    setShowExtraPhones(false);
    localStorage.removeItem(DRAFT_KEY);
  };

  const updateField = <K extends keyof Draft>(field: K, value: Draft[K]) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      persistDraft(next);
      return next;
    });
  };

  const toggleDay = (day: string) => {
    setForm((prev) => {
      const has = prev.contactDays.includes(day);
      const next = {
        ...prev,
        contactDays: has ? prev.contactDays.filter((d) => d !== day) : [...prev.contactDays, day],
      };
      persistDraft(next);
      return next;
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        if (i.path[0]) fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      // If errors are in collapsed phones, expand so user can see them
      if (fieldErrors.spousePhone || fieldErrors.workPhone) setShowExtraPhones(true);
      toast.error("Please check the form and try again.");
      return;
    }
    setErrors({});

    persistDraft(form);

    setSubmitting(true);
    setRetrying(false);

    const data = result.data;
    const address = `${data.houseNumber} ${data.street}, ${data.postalCode}`;

    const body = JSON.stringify({
      name: data.name,
      cell: data.cell,
      phone: data.cell, // alias for backward-compat with existing edge function
      spousePhone: data.spousePhone ?? "",
      workPhone: data.workPhone ?? "",
      email: data.email,
      houseNumber: data.houseNumber,
      street: data.street,
      postalCode: data.postalCode,
      address,
      service: data.service,
      message: data.message ?? "",
      contactTime: data.contactTime ?? "",
      contactDays: data.contactDays ?? [],
    });

    try {
      const res = await (async () => {
        let lastError: unknown;
        const maxAttempts = 3;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          if (attempt > 0) {
            setRetrying(true);
            await new Promise((r) => setTimeout(r, attempt * 1000));
          }
          try {
            const r = await fetch(EDGE_FN_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body,
            });
            if (r.status >= 400 && r.status < 500) return r; // don't retry 4xx
            if (r.ok) return r;
            lastError = new Error(`Server error ${r.status}`);
          } catch (err) {
            lastError = err;
          }
        }
        throw lastError;
      })();

      setRetrying(false);

      if (!res.ok) {
        if (res.status === 429) {
          toast.error("Too many requests — please wait a moment and try again.");
        } else if (res.status >= 500) {
          toast.error("Server error — we'll retry automatically.");
        } else {
          toast.error("Submission failed. Please call us at (613) 864-1485.");
        }
        return;
      }

      localStorage.removeItem(DRAFT_KEY);
      setSubmitted(true);
      toast.success("Quote request received! We'll reach out within 24 hours.");

      setTimeout(() => {
        resetForm();
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      setRetrying(false);
      const isNetwork = err instanceof TypeError;
      toast.error(isNetwork ? "Network error — check your connection." : "Server error — we'll retry automatically.");
    } finally {
      setSubmitting(false);
      setRetrying(false);
    }
  };

  return (
    <section id="quote" className="relative py-12 md:py-16 bg-gradient-dark text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 opacity-50 pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 -right-40 w-[600px] h-[600px] rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container relative z-10 max-w-[1200px]">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left content */}
          <Reveal className="lg:col-span-5">
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-3">
              Get Started
            </p>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-semibold mb-4 leading-[1.1]">
              Get your free driveway quote today
            </h2>
            <p className="text-primary-foreground/75 text-base md:text-lg leading-relaxed mb-8">
              Fast response. No obligation. Competitive pricing. Tell us about your project and we'll be in touch within 24 hours.
            </p>

            <div className="space-y-5">
              <a
                href="tel:+16138641485"
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-accent/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-primary-foreground/60">Call us</div>
                  <div className="font-semibold text-lg group-hover:text-accent transition-colors">(613) 864-1485</div>
                </div>
              </a>

              <a
                href="mailto:PierreSr@OttawaDrivewayExperts.com"
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-accent/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-accent-foreground" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-wider text-primary-foreground/60">Email</div>
                  <div className="font-semibold text-sm md:text-lg whitespace-nowrap group-hover:text-accent transition-colors">
                    PierreSr@OttawaDrivewayExperts.com
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-primary-foreground/60">Service Area</div>
                  <div className="font-semibold text-lg">Ottawa & Surrounding Areas</div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal className="lg:col-span-7" delay={150}>
            <div className="bg-card text-card-foreground rounded-3xl p-7 md:p-10 shadow-elegant">
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-gold mx-auto flex items-center justify-center mb-6 shadow-gold">
                    <Check className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <h3 className="font-display text-3xl font-semibold mb-3">Thank you!</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Your quote request was received. We'll reach out within 24 hours to discuss your project.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <fieldset disabled={submitting} className="contents">
                    {/* Name + Cell */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <Field
                        label="Full Name *"
                        name="name"
                        placeholder="John Smith"
                        autoComplete="name"
                        error={errors.name}
                        required
                        value={form.name}
                        onChange={(v) => updateField("name", v)}
                      />
                      <Field
                        label="Cell Number *"
                        name="cell"
                        type="tel"
                        placeholder="(613) 555-0100"
                        autoComplete="tel"
                        error={errors.cell}
                        required
                        value={form.cell}
                        onChange={(v) => updateField("cell", v)}
                      />
                    </div>

                    {/* Additional phone numbers (collapsible) */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setShowExtraPhones((s) => !s)}
                        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-accent transition-colors -mt-2"
                        aria-expanded={showExtraPhones}
                        aria-controls="extra-phones"
                      >
                        {showExtraPhones ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {showExtraPhones ? "Hide additional numbers" : "+ Add another number"}
                      </button>

                      {showExtraPhones && (
                        <div id="extra-phones" className="mt-4 grid md:grid-cols-2 gap-5">
                          <Field
                            label="Spouse's Number"
                            name="spousePhone"
                            type="tel"
                            placeholder="(613) 555-0100"
                            autoComplete="tel"
                            error={errors.spousePhone}
                            value={form.spousePhone}
                            onChange={(v) => updateField("spousePhone", v)}
                          />
                          <Field
                            label="Work Number"
                            name="workPhone"
                            type="tel"
                            placeholder="(613) 555-0100"
                            autoComplete="tel"
                            error={errors.workPhone}
                            value={form.workPhone}
                            onChange={(v) => updateField("workPhone", v)}
                          />
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <Field
                      label="Email *"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      error={errors.email}
                      required
                      value={form.email}
                      onChange={(v) => updateField("email", v)}
                    />

                    {/* Service Address — grouped */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Service Address *</label>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="md:col-span-1">
                          <input
                            id="houseNumber"
                            name="houseNumber"
                            type="text"
                            inputMode="numeric"
                            placeholder="123"
                            autoComplete="address-line1"
                            aria-label="House number"
                            aria-invalid={!!errors.houseNumber}
                            required
                            value={form.houseNumber}
                            onChange={(e) => updateField("houseNumber", e.target.value)}
                            className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition text-foreground placeholder:text-muted-foreground"
                          />
                          {errors.houseNumber && <p className="mt-1.5 text-sm text-destructive">{errors.houseNumber}</p>}
                        </div>
                        <div className="md:col-span-2">
                          <input
                            id="street"
                            name="street"
                            type="text"
                            placeholder="Elm Street"
                            autoComplete="street-address"
                            aria-label="Street name"
                            aria-invalid={!!errors.street}
                            required
                            value={form.street}
                            onChange={(e) => updateField("street", e.target.value)}
                            className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition text-foreground placeholder:text-muted-foreground"
                          />
                          {errors.street && <p className="mt-1.5 text-sm text-destructive">{errors.street}</p>}
                        </div>
                        <div className="md:col-span-1">
                          <input
                            id="postalCode"
                            name="postalCode"
                            type="text"
                            inputMode="text"
                            placeholder="K2T 1C1"
                            autoComplete="postal-code"
                            aria-label="Postal code"
                            aria-invalid={!!errors.postalCode}
                            required
                            maxLength={7}
                            value={form.postalCode}
                            onChange={(e) => updateField("postalCode", formatPostal(e.target.value))}
                            className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition text-foreground placeholder:text-muted-foreground uppercase"
                          />
                          {errors.postalCode && <p className="mt-1.5 text-sm text-destructive">{errors.postalCode}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Service */}
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-foreground mb-2">
                        Service Needed *
                      </label>
                      <select
                        id="service"
                        name="service"
                        required
                        value={form.service}
                        onChange={(e) => updateField("service", e.target.value)}
                        className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition text-foreground"
                      >
                        <option value="" disabled>Select a service...</option>
                        {services.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {errors.service && <p className="mt-1.5 text-sm text-destructive">{errors.service}</p>}
                    </div>

                    {/* Project Details */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                        Project Details <span className="text-muted-foreground font-normal">(optional)</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        maxLength={1000}
                        value={form.message}
                        onChange={(e) => updateField("message", e.target.value)}
                        placeholder="Tell us about your driveway, approximate size, and any questions..."
                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition resize-none text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    {/* Contact Preference */}
                    <div className="pt-2">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
                        Contact Preference
                      </h3>

                      <div className="mb-5">
                        <label className="block text-sm font-medium text-foreground mb-2">Best time to contact</label>
                        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Best time to contact">
                          {TIMES.map((t) => (
                            <Pill
                              key={t}
                              role="radio"
                              active={form.contactTime === t}
                              onClick={() =>
                                updateField("contactTime", form.contactTime === t ? "" : t)
                              }
                            >
                              {t}
                            </Pill>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Best day(s) available</label>
                        <div className="flex flex-wrap gap-2" role="group" aria-label="Best days available">
                          {DAYS.map((d) => (
                            <Pill
                              key={d}
                              active={form.contactDays.includes(d)}
                              onClick={() => toggleDay(d)}
                            >
                              {d}
                            </Pill>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button type="submit" variant="gold" size="lg" className="w-full gap-2" disabled={submitting}>
                      {submitting ? (retrying ? "Retrying..." : "Sending...") : "Request Free Quote"}
                      {!submitting && <Send className="w-4 h-4" />}
                    </Button>
                  </fieldset>

                  <p className="text-xs text-muted-foreground text-center">
                    No obligation • Response within 24 hours
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
}

const Field = ({ label, name, type = "text", placeholder, autoComplete, error, required, value, onChange }: FieldProps) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-foreground mb-2">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      required={required}
      aria-invalid={!!error}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition text-foreground placeholder:text-muted-foreground"
    />
    {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
  </div>
);

interface PillProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  role?: string;
}

const Pill = ({ active, onClick, children, role }: PillProps) => (
  <button
    type="button"
    role={role}
    aria-checked={role === "radio" ? active : undefined}
    aria-pressed={role !== "radio" ? active : undefined}
    onClick={onClick}
    className={
      "px-4 h-10 rounded-full text-sm font-medium border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent/40 " +
      (active
        ? "bg-accent text-accent-foreground border-accent shadow-gold"
        : "bg-secondary text-foreground border-border hover:border-accent/60 hover:text-foreground")
    }
  >
    {children}
  </button>
);
