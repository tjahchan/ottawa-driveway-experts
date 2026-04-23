import { MapPin, Sparkles, BadgeDollarSign, Clock, ShieldCheck } from "lucide-react";
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
    text: "No surprises. Honest, detailed quotes, what you see is what you pay.",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    text: "Most driveways completed in 1–2 days, with minimal disruption to your day.",
  },
  {
    icon: ShieldCheck,
    title: "Satisfaction Guaranteed",
    text: "Fully insured workmanship backed by a written satisfaction guarantee.",
  },
];

export const WhyUs = () => {
  return (
    <section id="why-us" className="relative py-12 md:py-16 bg-gradient-dark text-primary-foreground overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl bg-accent/20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl bg-accent/30 pointer-events-none" />

      <div className="container relative z-10 max-w-[1200px]">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <Reveal className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-3">
                Why Choose Us
              </p>
              <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-semibold mb-5 leading-[1.1]">
                Craftsmanship that{" "}
                <span className="text-gradient-gold italic">stands the test</span>{" "}
                of Ottawa winters.
              </h2>
              <p className="text-primary-foreground/75 text-base md:text-lg leading-relaxed">
                We're trusted by Ottawa homeowners for delivering durable, high-quality driveways built to last. Every project is completed with precision, premium materials, and a commitment to doing it right.
              </p>
            </div>
          </Reveal>

          <div className="lg:col-span-7 space-y-3">
            {reasons.map((r, i) => (
              <Reveal key={r.title} delay={i * 80}>
                <div className="group flex gap-4 p-5 md:p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm hover:bg-white/[0.08] hover:border-accent/40 transition-all duration-500">
                  <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <r.icon className="w-5 h-5 md:w-6 md:h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl md:text-2xl font-semibold mb-2">
                      {r.title}
                    </h3>
                    <p className="text-primary-foreground/70 leading-relaxed">
                      {r.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
