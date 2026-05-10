import { Phone } from "lucide-react";
import { useEffect, useState } from "react";

export const StickyCallButton = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="tel:+16138641485"
      aria-label="Call Ottawa Driveway Experts"
      className={`md:hidden fixed bottom-5 right-5 z-50 flex items-center gap-2 px-5 h-14 rounded-full bg-gradient-gold text-accent-foreground font-semibold shadow-gold transition-all duration-500 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <Phone className="w-5 h-5" />
      Call Now
    </a>
  );
};
