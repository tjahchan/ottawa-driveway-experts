import { Award, Hammer, Star } from "lucide-react";
import { Reveal } from "./Reveal";

const stats = [
  { icon: Hammer, value: "100+", label: "Driveways Completed" },
  { icon: Star, value: "5.0", label: "Average Rating" },
  { icon: Award, value: "10+", label: "Years of Experience" },
];

export const SocialProof = () => {
  return (
    <section className="py-12 md:py-16 bg-primary text-primary-foreground border-y border-white/10">
      <div className="container">
        <Reveal>
          <p className="text-center text-xs md:text-sm uppercase tracking-[0.3em] text-primary-foreground/60 mb-8">
            Trusted by homeowners across Ottawa
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100}>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
                <div className="w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center shrink-0">
                  <s.icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <div className="font-display text-3xl md:text-4xl font-semibold text-gradient-gold leading-none">
                    {s.value}
                  </div>
                  <div className="text-sm text-primary-foreground/70 mt-1">
                    {s.label}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
