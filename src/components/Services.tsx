import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import asphalt from "@/assets/service-asphalt.jpg";
import sealing from "@/assets/service-sealing.jpg";
import interlock from "@/assets/service-interlock.jpg";
import repair from "@/assets/service-repair.jpg";
import crack from "@/assets/service-crack.jpg";
import cutout from "@/assets/service-cutout.jpg";
import ramp from "@/assets/service-ramp.jpg";
import concrete from "@/assets/service-concrete.jpg";
import aggregates from "@/assets/service-aggregates.jpg";
import lines from "@/assets/service-lines.jpg";

const featured = [
  {
    title: "Asphalt Driveway Paving",
    description:
      "Smooth, durable asphalt that boosts curb appeal and survives Ottawa winters.",
    image: asphalt,
    tag: "Most Popular",
  },
  {
    title: "Driveway Sealing",
    description:
      "Premium sealcoat that restores a rich, deep-black finish and extends life.",
    image: sealing,
  },
  {
    title: "Interlock & Pavers",
    description:
      "Custom interlock driveways, walkways, and patios that elevate your home.",
    image: interlock,
  },
  {
    title: "Repairs & Resurfacing",
    description:
      "Cracks, potholes, fading — we restore tired driveways without full replacement.",
    image: repair,
  },
];

const additional = [
  { title: "Asphalt Crack Filling", image: crack },
  { title: "Cutouts, Overlays & Patching", image: cutout },
  { title: "Asphalt Lips & Ramps", image: ramp },
  { title: "Concrete Services", image: concrete },
  { title: "Aggregates Supply", image: aggregates },
  { title: "Line Painting & Symbols", image: lines },
];

export const Services = () => {
  return (
    <section id="services" className="py-14 md:py-20 bg-background">
      <div className="container max-w-[1200px]">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-3">
              What We Do
            </p>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-4 leading-[1.1]">
              Complete driveway solutions
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              From fresh asphalt paving to custom interlock — craftsmanship that lasts in Ottawa.
            </p>
          </div>
        </Reveal>

        {/* Featured services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-10 md:mb-14">
          {featured.map((s, i) => (
            <Reveal key={s.title} delay={i * 60}>
              <a
                href="#quote"
                className="group relative block rounded-[20px] overflow-hidden bg-card shadow-card hover:shadow-elegant transition-all duration-400 hover:scale-[1.02]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    width={1024}
                    height={768}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-darker/90 via-surface-darker/30 to-transparent" />
                  {s.tag && (
                    <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                      {s.tag}
                    </span>
                  )}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent">
                    <ArrowUpRight className="w-5 h-5 transition-transform group-hover:rotate-12" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 text-white">
                    <h3 className="font-display text-xl md:text-2xl font-semibold mb-2">
                      {s.title}
                    </h3>
                    <p className="text-white/85 text-sm leading-relaxed max-w-md mb-3">
                      {s.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-accent text-sm font-semibold">
                      Learn More
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        {/* Additional services - horizontal scroll */}
        <Reveal>
          <div className="flex items-end justify-between mb-5 md:mb-6">
            <div>
              <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-2">
                Additional Services
              </p>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground leading-tight">
                Specialty work, done right
              </h3>
            </div>
            <p className="hidden md:block text-sm text-muted-foreground">
              Swipe to explore →
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="-mx-4 md:-mx-6 px-4 md:px-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            <div className="flex gap-4 md:gap-5 pb-2">
              {additional.map((s) => (
                <a
                  key={s.title}
                  href="#quote"
                  className="group relative shrink-0 w-[260px] md:w-[300px] snap-start rounded-[16px] overflow-hidden bg-card shadow-card hover:shadow-elegant transition-all duration-400 hover:scale-[1.03]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={s.image}
                      alt={s.title}
                      width={600}
                      height={450}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-darker/90 via-surface-darker/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 text-white">
                      <h4 className="font-display text-base md:text-lg font-semibold mb-1 leading-tight">
                        {s.title}
                      </h4>
                      <span className="inline-flex items-center gap-1 text-accent text-xs font-semibold">
                        Learn More
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
