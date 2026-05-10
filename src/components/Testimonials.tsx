import { useEffect, useRef, useState, useCallback } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "./Reveal";

const reviews = [
  {
    name: "Sarah M.",
    location: "Kanata, ON",
    rating: 5,
    quote:
      "Professional, fast, and incredible results. Our driveway looks brand new. Neighbors keep stopping to ask who did it.",
  },
  {
    name: "David L.",
    location: "Orleans, ON",
    rating: 5,
    quote:
      "From quote to clean-up, everything was seamless. Pierre and his crew clearly take pride in their work. Highly recommend.",
  },
  {
    name: "Jennifer R.",
    location: "Barrhaven, ON",
    rating: 5,
    quote:
      "Best decision we made this summer. The interlock driveway completely transformed our home's curb appeal. Stunning work.",
  },
  {
    name: "Marc T.",
    location: "Nepean, ON",
    rating: 5,
    quote:
      "Honest pricing, no hidden fees, and the sealing job has held up beautifully through two Ottawa winters now.",
  },
];

export const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const total = reviews.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);

  // FIX 3 — use a ref so the interval never restarts when `next` identity changes
  const nextRef = useRef(next);
  useEffect(() => { nextRef.current = next; }, [next]);
  useEffect(() => {
    const id = setInterval(() => nextRef.current(), 5000);
    return () => clearInterval(id);
  }, []); // empty deps — interval never restarts

  return (
    <section id="reviews" className="py-12 md:py-16 bg-background">
      <div className="container max-w-[1100px]">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center mb-8 md:mb-10">
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-3">
              Reviews
            </p>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-3 leading-[1.1]">
              Loved by Ottawa homeowners
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="hidden md:flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Trusted for 5-Star Service Across Ottawa</strong>
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="relative max-w-3xl mx-auto">
            <div className="overflow-hidden rounded-3xl">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${index * 100}%)` }}
              >
                {reviews.map((r) => (
                  <article
                    key={r.name}
                    className="shrink-0 w-full px-1"
                  >
                    <div className="relative h-full p-5 md:p-9 rounded-3xl bg-card border border-border shadow-card text-center md:text-left">
                      <Quote className="hidden md:block absolute top-6 right-6 w-9 h-9 text-accent/20" />
                      <div className="hidden md:flex mb-4">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                        ))}
                      </div>
                      <blockquote className="font-display text-base md:text-xl text-foreground leading-[1.5] mb-5 italic max-w-md md:max-w-none mx-auto">
                        "{r.quote}"
                      </blockquote>
                      <footer className="flex flex-col md:flex-row items-center gap-2 md:gap-3 pt-4 border-t border-border">
                        <div className="w-11 h-11 rounded-full bg-gradient-gold flex items-center justify-center font-semibold text-accent-foreground">
                          {r.name.charAt(0)}
                        </div>
                        <div className="text-center md:text-left">
                          <div className="font-semibold text-foreground">{r.name}</div>
                          <div className="text-sm text-muted-foreground">{r.location}</div>
                        </div>
                      </footer>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mt-5">
              <button
                onClick={prev}
                aria-label="Previous review"
                className="w-11 h-11 rounded-full bg-card border border-border shadow-card flex items-center justify-center text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    aria-label={`Go to review ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === i ? "w-8 bg-accent" : "w-2 bg-border hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                aria-label="Next review"
                className="w-11 h-11 rounded-full bg-card border border-border shadow-card flex items-center justify-center text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
