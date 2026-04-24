import { Phone, Mail, MapPin } from "lucide-react";
import logoFull from "@/assets/chevrier-logo-transparent.png";

export const Footer = () => {
  return (
    <footer className="bg-surface-darker text-primary-foreground/70 pt-12 pb-8 border-t border-white/5">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8 md:gap-8 mb-10">
          <div className="md:col-span-2">
            <img
              src={logoFull}
              alt="Chevrier Group — Ottawa Driveway Experts"
              className="h-20 md:h-24 w-auto object-contain mb-5 mx-auto md:mx-0"
              loading="lazy"
              decoding="async"
            />
            <p className="text-primary-foreground/60 max-w-md leading-relaxed text-center md:text-left mx-auto md:mx-0">
              Premium driveway paving, sealing and interlock services serving Ottawa and surrounding areas. Family-owned. Fully insured. Built to last.
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
                <a href="tel:+16138677130" className="flex items-start gap-3 hover:text-accent transition-colors">
                  <Phone className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
                  <span>(613) 867-7130</span>
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
