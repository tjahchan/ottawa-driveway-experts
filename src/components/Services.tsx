import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Reveal } from "./Reveal";
import asphalt from "@/assets/images/service-asphalt.jpg";
import sealing from "@/assets/images/service-sealing.jpg";
import interlock from "@/assets/images/transformation-interlock-after.png";
import repair from "@/assets/images/transformation-repairs-after.png";
import crack from "@/assets/images/service-crack.jpg";
import cutout from "@/assets/images/service-cutout.jpg";
import ramp from "@/assets/images/service-ramp.jpg";
import concrete from "@/assets/images/service-concrete.jpg";
import aggregates from "@/assets/images/service-aggregates.jpg";
import lines from "@/assets/images/service-lines.jpg";

const services = [
  {
    title: "Asphalt Driveway Paving",
    tagline:
      "Professional asphalt driveway paving in Ottawa built for durability, smooth finish, and long-term performance.",
    description:
      "Chevrier Group provides professional asphalt driveway paving across Ottawa and the surrounding areas. Our crews use commercial-grade hot-mix asphalt for a smooth, durable finish that holds up through Ottawa's harsh freeze-thaw winters. Whether you're replacing an old cracked driveway or paving a new one, we deliver long-lasting results with clean edges and proper drainage — on time and within budget.",
    image: asphalt,
    tag: "Most Popular",
  },
  {
    title: "Driveway Sealing",
    tagline:
      "Driveway sealing in Ottawa that protects against weather damage and extends the life of your asphalt.",
    description:
      "Protect your Ottawa driveway with Chevrier Group's professional sealing service. Our coal-tar and polymer-modified sealers create a weather-resistant barrier against UV rays, road salt, oil spills, and moisture — the leading causes of premature asphalt deterioration in the Ottawa climate. Sealing every 2–3 years significantly extends your driveway's lifespan and restores that fresh, dark finish.",
    image: sealing,
  },
  {
    title: "Interlock & Pavers",
    tagline:
      "Custom interlock and paver driveways in Ottawa designed for strength, style, and lasting curb appeal.",
    description:
      "Upgrade your home's curb appeal with custom interlock and paver driveways by Chevrier Group, serving Ottawa homeowners with pride. We design and install interlocking stone driveways, walkways, and patios that combine timeless style with exceptional durability. Each installation is built on a properly compacted base to prevent shifting or settling through Ottawa's cold winters — guaranteed to impress.",
    image: interlock,
  },
  {
    title: "Repairs & Resurfacing",
    tagline:
      "Driveway repair and resurfacing in Ottawa to restore worn asphalt without full replacement.",
    description:
      "Not every driveway needs to be fully replaced. Chevrier Group's repair and resurfacing service restores deteriorating asphalt driveways across Ottawa at a fraction of the cost of a new install. We assess surface damage, address base issues where needed, and apply a fresh asphalt overlay that bonds to your existing driveway — giving it years of renewed life and a clean, professional appearance.",
    image: repair,
  },
  {
    title: "Crack Filling & Patching",
    tagline:
      "Asphalt crack filling and patching in Ottawa to prevent further damage and maintain surface integrity.",
    description:
      "Ottawa's freeze-thaw cycles are brutal on asphalt, and small cracks can quickly become costly structural problems if left unaddressed. Chevrier Group's crack filling and patching service seals hairline cracks and larger voids using rubberized hot-pour filler and cold-mix patch compounds. Treated early, these repairs prevent water infiltration, sub-base erosion, and the kind of damage that leads to full driveway replacement.",
    image: crack,
  },
  {
    title: "Asphalt Cutouts, Overlays & Patching",
    tagline:
      "Asphalt cutouts and overlays in Ottawa to repair damaged areas and restore structural strength.",
    description:
      "When isolated sections of your Ottawa driveway or parking lot are damaged beyond surface repair, Chevrier Group performs precise asphalt cutouts and overlays to restore structural integrity. We saw-cut the damaged zone, remove deteriorated material, repair the base, and install new hot-mix asphalt — matching grade and texture for a seamless result. Ideal for residential driveways and commercial lots across Ottawa, Ontario.",
    image: cutout,
  },
  {
    title: "Asphalt Lips / Ramps",
    tagline:
      "Smooth asphalt lips and driveway ramps in Ottawa for safe transitions and improved accessibility.",
    description:
      "A raised driveway edge can cause vehicle scraping, tripping hazards, and water pooling — all common issues in Ottawa properties due to frost heave and seasonal settlement. Chevrier Group builds and repairs asphalt lips and transition ramps to create smooth, safe connections between your driveway and the road, garage floor, or curb. Clean, durable, and built to handle Ottawa's winters.",
    image: ramp,
  },
  {
    title: "Concrete Services",
    tagline:
      "Concrete driveway and surface services in Ottawa built for durability and heavy use.",
    description:
      "For Ottawa homeowners and commercial property owners who want the longevity of concrete, Chevrier Group delivers expert concrete driveway installation and repair. Concrete surfaces are ideal for heavy-use areas, garage aprons, and properties requiring a premium finish. We handle forming, pouring, finishing, and curing — ensuring proper reinforcement and slope for Ottawa's demanding climate conditions.",
    image: concrete,
  },
  {
    title: "Aggregates Supply",
    tagline:
      "Premium aggregate supply in Ottawa for landscaping, construction, and driveway foundations.",
    description:
      "A strong driveway starts with the right base material. Chevrier Group supplies premium aggregates in Ottawa including crushed stone, gravel, and granular base material for residential and commercial projects. Whether you're preparing a sub-base for a new driveway, finishing a landscaping project, or filling drainage areas across Ottawa and the surrounding region, we deliver quality materials when and where you need them.",
    image: aggregates,
  },
  {
    title: "Line Painting & Symbols",
    tagline:
      "Professional line painting and pavement marking services in Ottawa for clean, visible layouts.",
    description:
      "Clear, well-maintained pavement markings improve safety, traffic flow, and professional appearance for commercial and municipal properties across Ottawa, Ontario. Chevrier Group provides professional line painting and symbol stencilling for parking lots, loading zones, fire lanes, accessible spaces, and roadway markings. We use durable traffic-grade paint designed to withstand Ottawa's harsh weather conditions season after season.",
    image: lines,
  },
];

export const Services = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedIndex(expandedIndex === index ? null : index);
  };

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

        <div className="max-w-3xl mx-auto">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="sticky top-20 md:static mb-4 md:mb-5"
              style={{ zIndex: i + 1 }}
            >
              <Reveal delay={Math.min(i * 50, 200)}>
                <div className="group relative block rounded-[20px] overflow-hidden bg-card shadow-card hover:shadow-elegant transition-all duration-400 md:hover:-translate-y-1">
                  {/* Image area — links to quote */}
                  <a href="#quote" className="block">
                    <div className="relative aspect-[16/10] sm:aspect-[16/8] md:aspect-[16/6] overflow-hidden">
                      <img
                        src={s.image}
                        alt={`${s.title} in Ottawa, Ontario — Chevrier Group`}
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
                        <p className="text-white/85 text-sm md:text-base leading-snug max-w-2xl line-clamp-2">
                          {s.tagline}
                        </p>
                      </div>
                    </div>
                  </a>

                  {/* Expandable Learn More section */}
                  <div className="px-4 md:px-6 py-3 md:py-4 border-t border-border/50">
                    <div className="flex items-center justify-between gap-4">
                      <button
                        onClick={(e) => toggleExpand(i, e)}
                        aria-expanded={expandedIndex === i}
                        aria-controls={`service-desc-${i}`}
                        className="inline-flex items-center gap-1.5 text-accent text-sm font-semibold hover:gap-2.5 transition-all"
                      >
                        {expandedIndex === i ? "Show Less" : "Learn More"}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${
                            expandedIndex === i ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <a
                        href="#quote"
                        className="inline-flex items-center gap-1 text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
                      >
                        Get a Quote
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* Animated description panel */}
                    <div
                      id={`service-desc-${i}`}
                      className="overflow-hidden transition-all duration-300 ease-in-out"
                      style={{
                        maxHeight: expandedIndex === i ? "200px" : "0px",
                        opacity: expandedIndex === i ? 1 : 0,
                      }}
                    >
                      <p className="text-muted-foreground text-sm md:text-base leading-relaxed pt-3 pb-1">
                        {s.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
