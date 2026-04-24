import { useRef, useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import { Reveal } from "./Reveal";
import beforeAsphalt from "@/assets/transformation-asphalt-before.png";
import afterAsphalt from "@/assets/transformation-asphalt-after.png";
import beforeInterlock from "@/assets/transformation-interlock-before.png";
import afterInterlock from "@/assets/transformation-interlock-after.png";
import beforeRepairs from "@/assets/transformation-repairs-before.png";
import afterRepairs from "@/assets/transformation-repairs-after.png";

const projects = [
  {
    id: 1,
    title: "Asphalt Driveway Replacement",
    location: "Ottawa, ON",
    before: beforeAsphalt,
    after: afterAsphalt,
  },
  {
    id: 2,
    title: "Interlock Driveway Install",
    location: "Ottawa, ON",
    before: beforeInterlock,
    after: afterInterlock,
  },
  {
    id: 3,
    title: "Repairs & Resurfacing",
    location: "Ottawa, ON",
    before: beforeRepairs,
    after: afterRepairs,
  },
];

interface CompareProps {
  before: string;
  after: string;
  title: string;
}

const Compare = ({ before, after, title }: CompareProps) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePos = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      updatePos(clientX);
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [updatePos]);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/8] w-full overflow-hidden rounded-2xl select-none cursor-ew-resize bg-surface-dark"
      onMouseDown={(e) => {
        dragging.current = true;
        updatePos(e.clientX);
      }}
      onTouchStart={(e) => {
        dragging.current = true;
        updatePos(e.touches[0].clientX);
      }}
    >
      {/* After (full) */}
      <img
        src={after}
        alt={`${title}, after`}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      {/* Before (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${position}%` }}
      >
        <img
          src={before}
          alt={`${title}, before`}
          loading="lazy"
          className="absolute inset-0 h-full object-cover"
          style={{ width: containerRef.current?.offsetWidth || "100%", maxWidth: "none" }}
        />
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-surface-darker/80 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider pointer-events-none">
        Before
      </div>
      <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold uppercase tracking-wider pointer-events-none">
        After
      </div>

      {/* Hint overlay */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-darker/70 backdrop-blur-md text-white text-xs font-medium pointer-events-none">
        <MoveHorizontal className="w-3.5 h-3.5" />
        Drag or click to see the difference
      </div>

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_20px_rgba(0,0,0,0.5)] pointer-events-none"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-elegant flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M7 5L3 10L7 15M13 5L17 10L13 15" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export const BeforeAfter = () => {
  const [active, setActive] = useState(0);
  const total = projects.length;
  const project = projects[active];

  const next = () => setActive((i) => (i + 1) % total);
  const prev = () => setActive((i) => (i - 1 + total) % total);

  return (
    <section id="projects" className="py-12 md:py-16 bg-secondary">
      <div className="container max-w-[1100px]">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center mb-6 md:mb-8">
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-3">
              Real Transformations
            </p>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-3 leading-[1.1]">
              See the difference
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Real driveways, transformed across Ottawa.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="relative bg-card rounded-3xl p-3 md:p-4 shadow-elegant">
            <div className="relative">
              <Compare before={project.before} after={project.after} title={project.title} />

              {/* Arrows */}
              <button
                onClick={prev}
                aria-label="Previous transformation"
                className="absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-card border border-border shadow-card flex items-center justify-center text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                aria-label="Next transformation"
                className="absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-card border border-border shadow-card flex items-center justify-center text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-3 md:mt-4 px-2">
              <div>
                <h3 className="font-display text-base md:text-lg font-semibold text-foreground">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-xs md:text-sm mt-0.5">{project.location}</p>
              </div>

              <div className="flex gap-2">
                {projects.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => setActive(i)}
                    aria-label={`View project ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      active === i ? "w-8 bg-accent" : "w-2 bg-border hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
