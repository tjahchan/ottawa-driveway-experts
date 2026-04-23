import { ClipboardList, CalendarCheck, Sparkles } from "lucide-react";
import { Reveal } from "./Reveal";

const steps = [
  {
    n: "01",
    icon: ClipboardList,
    title: "Request a Quote",
    text: "Fill out our quick form or call us. We'll respond within 24 hours with an honest estimate.",
  },
  {
    n: "02",
    icon: CalendarCheck,
    title: "Schedule Your Service",
    text: "Pick a date that works for you. We'll handle prep, materials, and permits where needed.",
  },
  {
    n: "03",
    icon: Sparkles,
    title: "Enjoy Your New Driveway",
    text: "Sit back as we transform your property. Most projects completed in 1 to 2 days.",
  },
];

export const Process = () => {
  return (
    <section className="py-12 md:py-16 bg-secondary">
      <div className="container max-w-[1200px]">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center mb-8 md:mb-12">
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-3">
              How It Works
            </p>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-3 leading-[1.1]">
              Simple. Transparent. Done right.
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Three easy steps to your dream driveway.
            </p>
          </div>
        </Reveal>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {/* connector line */}
          <div className="hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 120}>
              <div className="relative text-center px-4">
                <div className="relative inline-flex mb-6">
                  <div className="relative w-20 h-20 rounded-full bg-card shadow-elegant flex items-center justify-center border border-border">
                    <s.icon className="w-8 h-8 text-accent" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-gold text-accent-foreground text-xs font-bold flex items-center justify-center shadow-gold">
                    {s.n}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
                  {s.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {s.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
