import { MapPin, Sparkles, BadgeDollarSign, Clock, ShieldCheck, Award } from "lucide-react";
import { Reveal } from "./Reveal";

const reasons = [
  {
    icon: MapPin,
    title: "Local Ottawa Experts",
    text: "Born and built in Ottawa. We know the climate, the soil, and what holds up.",
  },
  {
    icon: Sparkles,
    title: "Premium Materials",
    text: "Top-grade asphalt, sealants, and interlock from trusted Canadian suppliers.",
  },
  {
    icon: BadgeDollarSign,
    title: "Transparent Pricing",
    text: "Honest, detailed quotes. What you see is what you pay, no surprises.",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    text: "Most driveways completed in 1, 2 days, with minimal disruption.",
  },
  {
    icon: ShieldCheck,
    title: "Satisfaction Guaranteed",
    text: "Fully insured workmanship backed by a written satisfaction guarantee.",
  },
  {
    icon: Award,
    title: "Proven Craftsmanship",
    text: "Hundreds of Ottawa driveways delivered with precision and pride.",
  },
];

export const WhyUs = () => {
  return (
    <section id="why-us" className="relative py-12 md:py-16 bg-gradient-dark text-primary-foreground overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl bg-accent/20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl bg-accent/30 pointer-events-none" />

      <div className="container relative z-10 max-w-[1200px]">
        {/* Header: label left, headline + subtext centered */}
        <div className="relative mb-8 md:mb-10">
          <Reveal>
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-3 text-center">
              Why Choose Us
            </p>
          </Reveal>
          <Reveal delay={80}>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-semibold mb-4 leading-[1.2]">
                Craftsmanship that{" "}
                <span className="text-gradient-gold italic">stands the test</span>{" "}
                of Ottawa winters.
              </h2>
              <p className="text-primary-foreground/75 text-base md:text-lg leading-relaxed">
                We're trusted across Ottawa for delivering high-quality driveways built to last. Every project is completed with precision, premium materials, and a commitment to doing it right.
              </p>
            </div>
          </Reveal>
        </div>

        {/* 2 x 3 grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 60}>
              <div className="group h-full flex gap-3 p-4 md:p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm hover:bg-white/[0.08] hover:border-accent/40 transition-all duration-500">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <r.icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-base md:text-lg font-semibold mb-1">
                    {r.title}
                  </h3>
                  <p className="text-primary-foreground/70 text-sm leading-relaxed">
                    {r.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
