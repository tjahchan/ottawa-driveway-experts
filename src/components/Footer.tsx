import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-surface-darker text-primary-foreground/70 pt-12 pb-8 border-t border-white/5">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8 md:gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center font-display font-bold text-accent-foreground">
                O
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-semibold text-lg text-white">Ottawa Driveway</span>
                <span className="text-xs uppercase tracking-[0.2em] text-white/50">Experts</span>
              </div>
            </div>
            <p className="text-primary-foreground/60 max-w-md leading-relaxed">
              Premium driveway paving, sealing & interlock services serving Ottawa and surrounding areas. Family-owned. Fully insured. Built to last.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-base">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Services", href: "#services" },
                { label: "Projects", href: "#projects" },
                { label: "Why Us", href: "#why-us" },
                { label: "Reviews", href: "#reviews" },
                { label: "Get a Quote", href: "#quote" },
              ].map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-accent transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-base">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="tel:+16138641485" className="flex items-start gap-3 hover:text-accent transition-colors">
                  <Phone className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
                  <span>(613) 864-1485</span>
                </a>
              </li>
              <li>
                <a href="mailto:ottawadrivewayexperts@gmail.com" className="flex items-start gap-3 hover:text-accent transition-colors">
                  <Mail className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
                  <span className="break-all">ottawadrivewayexperts@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
                <span>Ottawa, Ontario, Canada</span>
              </li>
              <li className="flex items-center gap-3 pt-1">
                <a
                  href="https://www.facebook.com/chevriergroup"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Facebook"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-accent/40 text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/ottawadrivewayexperts/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-accent/40 text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between text-xs text-primary-foreground/50">
          <p>© {new Date().getFullYear()} Ottawa Driveway Experts. All rights reserved.</p>
          <p>Driveway paving Ottawa • Asphalt • Sealing • Interlock</p>
        </div>
      </div>
    </footer>
  );
};
