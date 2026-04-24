import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import asphalt from "@/assets/service-asphalt.jpg";
import sealing from "@/assets/service-sealing.jpg";
import interlock from "@/assets/transformation-interlock-after.png";
import repair from "@/assets/transformation-repairs-after.png";
import crack from "@/assets/service-crack.jpg";

const services = [
  {
    title: "Asphalt Driveway Paving",
    description:
      "Professional asphalt driveway paving in Ottawa built for durability, smooth finish, and long-term performance.",
    image: asphalt,
    tag: "Most Popular",
  },
  {
    title: "Driveway Sealing",
    description:
      "Driveway sealing in Ottawa that protects against weather damage and extends the life of your asphalt.",
    image: sealing,
  },
  {
    title: "Interlock & Pavers",
    description:
      "Custom interlock and paver driveways in Ottawa designed for strength, style, and lasting curb appeal.",
    image: interlock,
  },
  {
    title: "Repairs & Resurfacing",
    description:
      "Driveway repair and resurfacing in Ottawa to restore worn asphalt without full replacement.",
    image: repair,
  },
  {
    title: "Crack Filling & Patching",
    description:
      "Asphalt crack filling and patching in Ottawa to prevent further damage and maintain surface integrity.",
    image: crack,
  },
  {
    title: "Asphalt Cutouts, Overlays & Patching",
    description:
      "Asphalt cutouts and overlays in Ottawa to repair damaged areas and restore structural strength.",
    image: asphalt,
  },
  {
    title: "Asphalt Lips / Ramps",
    description:
      "Smooth asphalt lips and driveway ramps in Ottawa for safe transitions and improved accessibility.",
    image: repair,
  },
  {
    title: "Concrete Services",
    description:
      "Concrete driveway and surface services in Ottawa built for durability and heavy use.",
    image: interlock,
  },
  {
    title: "Aggregates Supply",
    description:
      "Premium aggregate supply in Ottawa for landscaping, construction, and driveway foundations.",
    image: crack,
  },
  {
    title: "Line Painting & Symbols",
    description:
      "Professional line painting and pavement marking services in Ottawa for clean, visible layouts.",
    image: sealing,
  },
];

export const Services = () => {
  return (
    <section id="services" className="py-12 md:py-16 bg-background">
      <div className="container max-w-[1100px]">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center mb-8 md:mb-10">
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-3">
              What We Do
            </p>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-3 leading-[1.1]">
              Complete driveway solutions
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              From fresh asphalt paving to custom interlock, craftsmanship that lasts in Ottawa.
            </p>
          </div>
        </Reveal>

        {/* Stacked services — sticky stacking effect on mobile, regular stack on desktop */}
        <div className="max-w-3xl mx-auto">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="sticky top-20 md:static mb-4 md:mb-5"
              style={{ zIndex: i + 1 }}
            >
              <Reveal delay={Math.min(i * 50, 200)}>
                <a
                  href="#quote"
                  className="group relative block rounded-[20px] overflow-hidden bg-card shadow-card hover:shadow-elegant transition-all duration-400 md:hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] sm:aspect-[16/8] md:aspect-[16/6] overflow-hidden">
                    <img
                      src={s.image}
                      alt={s.title}
                      width={1200}
                      height={500}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-darker/95 via-surface-darker/60 to-surface-darker/15" />

                    {s.tag && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                        {s.tag}
                      </span>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                      <h3 className="font-display text-lg md:text-2xl font-semibold mb-1.5">
                        {s.title}
                      </h3>
                      <p className="text-white/85 text-sm md:text-base leading-snug max-w-2xl mb-2 line-clamp-2">
                        {s.description}
                      </p>
                      <span className="inline-flex items-center gap-1 text-accent text-sm font-semibold group-hover:gap-2 transition-all">
                        Learn More
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </a>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
