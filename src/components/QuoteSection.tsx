import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import { Phone, Mail, MapPin, Send, Check, Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { toast } from "sonner";
import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  phone: z.string().trim().min(7, "Valid phone required").max(30),
  email: z.string().trim().email("Valid email required").max(255),
  service: z.string().min(1, "Please select a service"),
  message: z.string().trim().max(1000).optional(),
});

const services = [
  "Asphalt Driveway Paving",
  "Driveway Sealing",
  "Interlock & Pavers",
  "Repairs & Resurfacing",
  "Other / Not Sure",
];

export const QuoteSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, WEBP or HEIC image.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image must be less than 5MB.");
      return;
    }
    setImage(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const result = schema.safeParse(data);
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
    setSubmitted(true);
    toast.success("Quote request received! We'll reach out within 24 hours.");
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
                href="tel:+16138677130"
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-accent/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-primary-foreground/60">Call us</div>
                  <div className="font-semibold text-lg group-hover:text-accent transition-colors">(613) 867-7130</div>
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
                  <div className="font-semibold text-base md:text-lg break-all group-hover:text-accent transition-colors">
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
                  <div className="grid md:grid-cols-2 gap-5">
                    <Field label="Full Name" name="name" placeholder="John Smith" error={errors.name} />
                    <Field label="Phone" name="phone" type="tel" placeholder="(613) 555-0100" error={errors.phone} />
                  </div>
                  <Field label="Email" name="email" type="email" placeholder="you@example.com" error={errors.email} />

                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-foreground mb-2">
                      Service Needed
                    </label>
                    <select
                      id="service"
                      name="service"
                      className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition text-foreground"
                      defaultValue=""
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
                      placeholder="Tell us about your driveway, approximate size, and any questions..."
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition resize-none text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <Button type="submit" variant="gold" size="lg" className="w-full gap-2">
                    Request Free Quote
                    <Send className="w-4 h-4" />
                  </Button>

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
}

const Field = ({ label, name, type = "text", placeholder, error }: FieldProps) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-foreground mb-2">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition text-foreground placeholder:text-muted-foreground"
    />
    {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
  </div>
);
