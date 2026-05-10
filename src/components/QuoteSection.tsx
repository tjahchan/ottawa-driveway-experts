import { useState, type FormEvent } from "react";
import { Phone, Mail, MapPin, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { toast } from "sonner";
import { z } from "zod";

const DRAFT_KEY = "quote_form_draft";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  phone: z.string().trim().min(7, "Valid phone required").max(30),
  email: z.string().trim().email("Valid email required").max(255),
  service: z.string().min(1, "Please select a service"),
  message: z.string().trim().max(1000).optional(),
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

const EDGE_FN_URL = "https://gorhemjqclfqedohjgtw.supabase.co/functions/v1/handle-quote-submission";

type Draft = {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
};

const initialFormState: Draft = { name: "", phone: "", email: "", service: "", message: "" };

async function fetchWithRetry(url: string, options: RequestInit, maxAttempts = 3): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, attempt * 1000));
    }
    try {
      const res = await fetch(url, options);
      if (res.status >= 400 && res.status < 500) return res; // don't retry 4xx
      if (res.ok) return res;
      // 5xx — retry
      lastError = new Error(`Server error ${res.status}`);
    } catch (err) {
      lastError = err; // network error — retry
    }
  }
  throw lastError;
}

export const QuoteSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Draft>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      return saved ? (JSON.parse(saved) as Draft) : initialFormState;
    } catch {
      return initialFormState;
    }
  });

  const resetForm = () => {
    setForm(initialFormState);
    localStorage.removeItem(DRAFT_KEY);
  };

  const handleFieldChange = (field: keyof Draft, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
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
      toast.error("Please check the form and try again.");
      return;
    }
    setErrors({});

    // Save draft before sending
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      // ignore
    }

    setSubmitting(true);
    setRetrying(false);

    const body = JSON.stringify({
      name: result.data.name,
      phone: result.data.phone,
      email: result.data.email,
      service: result.data.service,
      message: result.data.message ?? "",
    });

    try {
      let attemptCount = 0;
      const res = await (async () => {
        let lastError: unknown;
        const maxAttempts = 3;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          if (attempt > 0) {
            setRetrying(true);
            await new Promise((r) => setTimeout(r, attempt * 1000));
          }
          attemptCount = attempt + 1;
          try {
            const r = await fetch(EDGE_FN_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body,
            });
            if (r.status >= 400 && r.status < 500) return r; // don't retry 4xx
            if (r.ok) return r;
            lastError = new Error(`Server error ${r.status}`);
            // 5xx — loop again
            void attemptCount;
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

      // Reset form after 3 seconds so user can read the success message
      setTimeout(() => {
        resetForm();
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      setRetrying(false);
      const isNetwork = err instanceof TypeError;
      if (isNetwork) {
        toast.error("Network error — check your connection.");
      } else {
        toast.error("Server error — we'll retry automatically.");
      }
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
                href="mailto:ottawadrivewayexperts@gmail.com"
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-accent/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-accent-foreground" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-wider text-primary-foreground/60">Email</div>
                  <div className="font-semibold text-sm md:text-lg whitespace-nowrap group-hover:text-accent transition-colors">
                    ottawadrivewayexperts@gmail.com
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
                    <div className="grid md:grid-cols-2 gap-5">
                      <Field
                        label="Full Name *"
                        name="name"
                        placeholder="John Smith"
                        error={errors.name}
                        required
                        value={form.name}
                        onChange={(v) => handleFieldChange("name", v)}
                      />
                      <Field
                        label="Phone *"
                        name="phone"
                        type="tel"
                        placeholder="(613) 555-0100"
                        error={errors.phone}
                        required
                        value={form.phone}
                        onChange={(v) => handleFieldChange("phone", v)}
                      />
                    </div>
                    <Field
                      label="Email *"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      error={errors.email}
                      required
                      value={form.email}
                      onChange={(v) => handleFieldChange("email", v)}
                    />

                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-foreground mb-2">
                        Service Needed *
                      </label>
                      <select
                        id="service"
                        name="service"
                        required
                        value={form.service}
                        onChange={(e) => handleFieldChange("service", e.target.value)}
                        className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition text-foreground"
                      >
                        <option value="" disabled>Select a service...</option>
                        {services.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {errors.service && <p className="mt-1.5 text-sm text-destructive">{errors.service}</p>}
                    </div>

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
                        onChange={(e) => handleFieldChange("message", e.target.value)}
                        placeholder="Tell us about your driveway, approximate size, and any questions..."
                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition resize-none text-foreground placeholder:text-muted-foreground"
                      />
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
  error?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
}

const Field = ({ label, name, type = "text", placeholder, error, required, value, onChange }: FieldProps) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-foreground mb-2">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition text-foreground placeholder:text-muted-foreground"
    />
    {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
  </div>
);
