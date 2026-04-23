import { ArrowRight, Phone, Star, ShieldCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-driveway.jpg";

export const Hero = () => {
  return (
    <section
      id="top"
      className="relative flex items-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Premium luxury home in Ottawa with freshly paved asphalt driveway at golden hour"
          width={1920}
          height={1280}
          fetchPriority="high"
          className="w-full h-full object-cover scale-105 animate-fade-in-slow"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-darker/80 via-surface-darker/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 pt-28 pb-10 md:pt-32 md:pb-16 max-w-[1200px]">
        <div className="max-w-3xl">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs md:text-sm font-medium mb-6 animate-fade-in opacity-0"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Ottawa's Trusted Paving Specialists
          </div>

          <h1
            className="font-display text-white text-[2.25rem] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.15] md:leading-[1.1] font-semibold mb-5 animate-fade-in opacity-0"
            style={{ animationDelay: "0.25s" }}
          >
            Premium Driveways{" "}
            <span className="text-gradient-gold italic">Built to Last</span>{" "}
            in Ottawa
          </h1>

          <p
            className="text-white/85 text-base md:text-xl max-w-2xl mb-8 leading-relaxed animate-fade-in opacity-0"
            style={{ animationDelay: "0.4s" }}
          >
            Expert paving, sealing, and interlock services designed to elevate your home and withstand Ottawa's harsh climate.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-3 mb-8 animate-fade-in opacity-0"
            style={{ animationDelay: "0.55s" }}
          >
            <a href="#quote">
              <Button variant="gold" size="xl" className="w-full sm:w-auto gap-2 group">
                Get Your Free Quote
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </a>
            <a href="tel:+16138677130">
              <Button variant="outline-light" size="xl" className="w-full sm:w-auto gap-2">
                <Phone className="w-5 h-5" />
                Call Now
              </Button>
            </a>
          </div>

          <div
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/85 text-sm animate-fade-in opacity-0"
            style={{ animationDelay: "0.7s" }}
          >
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <span>5-Star Rated</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-accent" />
              <span>Fully Insured</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" />
              <span>Serving Ottawa & Surrounding Areas</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
