import { useRef, useState, useCallback, useEffect } from "react";
import { Reveal } from "./Reveal";
import before1 from "@/assets/before-1.jpg";
import after1 from "@/assets/after-1.jpg";
import before2 from "@/assets/before-2.jpg";
import after2 from "@/assets/after-2.jpg";
import before3 from "@/assets/before-3.jpg";
import after3 from "@/assets/after-3.jpg";

const projects = [
  {
    id: 1,
    title: "Full Asphalt Replacement",
    location: "Kanata, Ottawa",
    before: before1,
    after: after1,
  },
  {
    id: 2,
    title: "Premium Driveway Sealing",
    location: "Orleans, Ottawa",
    before: before2,
    after: after2,
  },
  {
    id: 3,
    title: "Interlock Driveway Install",
    location: "Barrhaven, Ottawa",
    before: before3,
    after: after3,
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
      className="relative aspect-[4/3] md:aspect-[16/10] w-full overflow-hidden rounded-2xl select-none cursor-ew-resize bg-surface-dark"
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
        alt={`${title} — after`}
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
          alt={`${title} — before`}
          loading="lazy"
          className="absolute inset-0 h-full object-cover"
          style={{ width: containerRef.current?.offsetWidth || "100%", maxWidth: "none" }}
        />
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-surface-darker/80 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider pointer-events-none">
        Before
      </div>
      <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold uppercase tracking-wider pointer-events-none">
        After
      </div>

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_20px_rgba(0,0,0,0.5)] pointer-events-none"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-elegant flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 5L3 10L7 15M13 5L17 10L13 15" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export const BeforeAfter = () => {
  const [active, setActive] = useState(0);
  const project = projects[active];

  return (
    <section id="projects" className="py-20 md:py-32 bg-secondary">
      <div className="container">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center mb-14 md:mb-16">
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-4">
              Real Transformations
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-5">
              See the difference
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Drag the slider to reveal real transformations from homes across Ottawa.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="bg-card rounded-3xl p-4 md:p-6 shadow-elegant">
            <Compare before={project.before} after={project.after} title={project.title} />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-6 px-2">
              <div>
                <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm mt-1">{project.location}</p>
              </div>

              <div className="flex gap-2">
                {projects.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => setActive(i)}
                    aria-label={`View project ${i + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      active === i ? "w-10 bg-accent" : "w-2.5 bg-border hover:bg-muted-foreground/50"
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
