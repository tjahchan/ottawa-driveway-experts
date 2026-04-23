import { Quote, Star } from "lucide-react";
import { Reveal } from "./Reveal";

const reviews = [
  {
    name: "Sarah M.",
    location: "Kanata, ON",
    rating: 5,
    quote:
      "Professional, fast, and incredible results. Our driveway looks brand new — neighbors keep stopping to ask who did it.",
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
  return (
    <section id="reviews" className="py-20 md:py-32 bg-background">
      <div className="container">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center mb-14 md:mb-20">
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-4">
              Reviews
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-5">
              Loved by Ottawa homeowners
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="flex">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={i * 80}>
              <article className="group relative h-full p-7 md:p-9 rounded-3xl bg-card border border-border shadow-card hover:shadow-elegant transition-all duration-500 hover:-translate-y-1">
                <Quote className="absolute top-7 right-7 w-10 h-10 text-accent/20 transition-colors duration-500 group-hover:text-accent/40" />
                <div className="flex mb-5">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <blockquote className="font-display text-lg md:text-xl text-foreground leading-relaxed mb-6 italic">
                  "{r.quote}"
                </blockquote>
                <footer className="flex items-center gap-3 pt-5 border-t border-border">
                  <div className="w-11 h-11 rounded-full bg-gradient-gold flex items-center justify-center font-semibold text-accent-foreground">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{r.name}</div>
                    <div className="text-sm text-muted-foreground">{r.location}</div>
                  </div>
                </footer>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
