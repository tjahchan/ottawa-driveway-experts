import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import asphalt from "@/assets/service-asphalt.jpg";
import sealing from "@/assets/service-sealing.jpg";
import interlock from "@/assets/service-interlock.jpg";
import repair from "@/assets/service-repair.jpg";

const services = [
  {
    title: "Asphalt Driveway Paving",
    description:
      "Smooth, durable asphalt driveways that enhance curb appeal and withstand Ottawa's harshest winters.",
    image: asphalt,
    tag: "Most Popular",
  },
  {
    title: "Driveway Sealing",
    description:
      "Protect your investment with premium sealcoat that restores that rich, deep-black finish and extends driveway life.",
    image: sealing,
  },
  {
    title: "Interlock & Pavers",
    description:
      "Custom interlock driveways, walkways, and patios that transform your home into a luxury statement.",
    image: interlock,
  },
  {
    title: "Repairs & Resurfacing",
    description:
      "Cracks, potholes, fading — we restore tired driveways to like-new condition without full replacement costs.",
    image: repair,
  },
];

export const Services = () => {
  return (
    <section id="services" className="py-20 md:py-32 bg-background">
      <div className="container">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center mb-14 md:mb-20">
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-4">
              What We Do
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-5">
              Complete driveway solutions
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              From fresh asphalt paving to custom interlock — we deliver craftsmanship that lasts in Ottawa, year after year.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <a
                href="#quote"
                className="group relative block rounded-3xl overflow-hidden bg-card shadow-card hover:shadow-elegant transition-all duration-500 hover:-translate-y-1"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-darker/85 via-surface-darker/20 to-transparent" />
                  {s.tag && (
                    <span className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                      {s.tag}
                    </span>
                  )}
                  <div className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent">
                    <ArrowUpRight className="w-5 h-5 transition-transform group-hover:rotate-12" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                    <h3 className="font-display text-2xl md:text-3xl font-semibold mb-2">
                      {s.title}
                    </h3>
                    <p className="text-white/85 text-sm md:text-base leading-relaxed max-w-md">
                      {s.description}
                    </p>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
