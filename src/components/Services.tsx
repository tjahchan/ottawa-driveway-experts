import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import asphalt from "@/assets/service-asphalt.jpg";
import sealing from "@/assets/service-sealing.jpg";
import interlock from "@/assets/service-interlock.jpg";
import repair from "@/assets/service-repair.jpg";

const featured = [
  {
    title: "Asphalt Driveway Paving",
    description: "Smooth, durable asphalt that boosts curb appeal and survives Ottawa winters.",
    image: asphalt,
    tag: "Most Popular",
  },
  {
    title: "Driveway Sealing",
    description: "Premium sealcoat that restores a rich, deep-black finish and extends life.",
    image: sealing,
  },
  {
    title: "Interlock & Pavers",
    description: "Custom interlock driveways, walkways, and patios that elevate your home.",
    image: interlock,
  },
  {
    title: "Repairs & Resurfacing",
    description: "Cracks, potholes, fading, we restore tired driveways without full replacement.",
    image: repair,
  },
];

const additional = [
  {
    title: "Asphalt Crack Filling",
    description:
      "Professional hot-rubberized crack filling that prevents water damage, stops cracks from spreading, and extends the life of your driveway through Ottawa's freeze-thaw cycles.",
  },
  {
    title: "Asphalt Cutouts, Overlays & Patching",
    description:
      "Targeted repairs for damaged sections. We cut out failing areas, patch deep potholes, and apply overlays to restore a smooth surface without full replacement.",
  },
  {
    title: "Asphalt Lips & Ramps",
    description:
      "Custom asphalt transitions and ramps for garages, sidewalks, and curbs. Smooth, safe, and built to handle daily vehicle traffic.",
  },
  {
    title: "Concrete Services",
    description:
      "Concrete walkways, pads, and curbs poured to last. Clean finishes that complement your driveway and home exterior.",
  },
  {
    title: "Aggregates Supply",
    description:
      "Quality crushed stone, gravel, and base materials delivered across Ottawa for driveway prep, drainage, and landscaping projects.",
  },
  {
    title: "Line Painting & Symbols",
    description:
      "Crisp, durable line painting for parking lots, driveways, and commercial properties. Standard layouts, accessibility symbols, and custom markings.",
  },
];

export const Services = () => {
  return (
    <section id="services" className="py-12 md:py-16 bg-background">
      <div className="container max-w-[1200px]">
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

        {/* Featured services - compact 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-10 md:mb-14">
          {featured.map((s, i) => (
            <Reveal key={s.title} delay={i * 60}>
              <a
                href="#quote"
                className="group relative block rounded-[18px] overflow-hidden bg-card shadow-card hover:shadow-elegant transition-all duration-400 hover:scale-[1.02]"
              >
                <div className="relative aspect-[16/11] md:aspect-[16/9] overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    width={1024}
                    height={576}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-darker/95 via-surface-darker/40 to-transparent" />
                  {s.tag && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                      {s.tag}
                    </span>
                  )}
                  <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent">
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-12" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 text-white">
                    <h3 className="font-display text-lg md:text-xl font-semibold mb-1.5">
                      {s.title}
                    </h3>
                    <p className="text-white/85 text-sm leading-snug max-w-md mb-2 line-clamp-2">
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

        {/* Additional services - accordion */}
        <Reveal>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-2">
                Additional Services
              </p>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground leading-tight">
                Specialty work, done right
              </h3>
            </div>

            <Accordion
              type="single"
              collapsible
              className="bg-card rounded-2xl shadow-card border border-border overflow-hidden"
            >
              {additional.map((s) => (
                <AccordionItem
                  key={s.title}
                  value={s.title}
                  className="border-b border-border last:border-b-0 px-5 md:px-6"
                >
                  <AccordionTrigger className="font-display text-base md:text-lg font-semibold text-foreground hover:no-underline py-4 md:py-5 text-left">
                    {s.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-5">
                    {s.description}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="text-center mt-6">
              <a
                href="#quote"
                className="inline-flex items-center gap-1 text-accent font-semibold hover:gap-2 transition-all"
              >
                Request a quote for any service
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
