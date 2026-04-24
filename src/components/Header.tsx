import { Phone, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import logoDark from "@/assets/chevrier-logo-navbar.png";
import logoLight from "@/assets/chevrier-logo-navbar-light.png";

const links = [
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Why Us", href: "#why-us" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#quote" },
];

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        <a href="#top" className="flex items-center group" aria-label="Chevrier Group — Ottawa Driveway Experts">
          <img
            src={scrolled ? logoDark : logoLight}
            alt="Chevrier Group — Ottawa Driveway Experts"
            className="h-9 sm:h-11 md:h-14 w-auto object-contain transition-all duration-300 group-hover:scale-[1.03]"
            loading="eager"
            decoding="async"
          />
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                scrolled ? "text-foreground/80" : "text-white/90"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href="tel:+16138677130" className="hidden sm:block">
            <Button variant="gold" size="default" className="gap-2">
              <Phone className="w-4 h-4" />
              (613) 867-7130
            </Button>
          </a>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
            className={`lg:hidden p-2 rounded-full transition-colors ${
              scrolled ? "text-foreground hover:bg-secondary" : "text-white hover:bg-white/10"
            }`}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 bg-background/95 backdrop-blur-xl ${
          open ? "max-h-96 border-b border-border" : "max-h-0"
        }`}
      >
        <nav className="container py-6 flex flex-col gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-3 px-2 text-foreground/80 font-medium border-b border-border/50 last:border-0 hover:text-accent transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a href="tel:+16138677130" className="mt-3 sm:hidden">
            <Button variant="gold" className="w-full gap-2">
              <Phone className="w-4 h-4" />
              (613) 867-7130
            </Button>
          </a>
        </nav>
      </div>
    </header>
  );
};
