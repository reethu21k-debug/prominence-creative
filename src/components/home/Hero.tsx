"use client";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Button from "@/components/ui/Button";

/**
 * Scroll-driven hero.
 * The section is tall (one viewport per stage); the inner stage is sticky.
 * Scroll progress (0 → 1) drives everything:
 *   - the headline swaps stage by stage
 *   - the cards leave a collapsed stack, scatter, then collapse again between stages.
 *
 * Responsive:
 *   - "wide" layout (laptops, desktops, landscape phones): cards orbit on an ellipse.
 *   - "portrait" layout (phones, portrait tablets): cards sit in a band above and a band
 *     below the text and swap bands each stage, so they never cover the copy or buttons.
 *   - Everything is sized with svh/vw caps so short screens don't clip.
 */

type Stage = { title: string; body: string };
type Mode = "portrait" | "wide";
type Pt = { x: number; y: number; r: number; s: number };

const STAGES: Stage[] = [
  { title: "Product shoots", body: "Studio and on-location photography built around what you sell." },
  { title: "Ad creatives", body: "Concepts and finished ads, sized for every placement." },
  { title: "AI video", body: "Motion and film, from storyboard to final frame." },
  { title: "Social content", body: "Always-on content made for each platform." },
];

// Add `src` (any image URL / import) to show real work. Without it, a gradient tile is used.
const CARDS: { label: string; from: string; to: string; src?: string }[] = [
  { label: "Skincare launch", from: "#ff7a45", to: "#7a1d0c" },
  { label: "Sneaker drop", from: "#4aa8ff", to: "#0c2a5c" },
  { label: "Cafe campaign", from: "#f4c76b", to: "#6b3b0a" },
  { label: "Fintech explainer", from: "#43d17a", to: "#0b4a2a" },
  { label: "Fragrance film", from: "#e58bd0", to: "#4a1646" },
  { label: "Creator series", from: "#9aa7ff", to: "#1d1f5c" },
];

const HEADING = "h-display text-balance text-fg text-[clamp(2.2rem,min(5.6vw,10.5svh),5.5rem)]";

const N = STAGES.length;
const C = CARDS.length;

/** Picks the card layout after mount (null on the server, so nothing mismatches on hydration). */
function useLayoutMode(): Mode | null {
  const [mode, setMode] = useState<Mode | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(max-aspect-ratio: 5 / 6)");
    const update = () => setMode(mq.matches ? "portrait" : "wide");
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return mode;
}

// Where card `i` sits (in vw / svh) when scattered for stage `s`.
function scatter(i: number, s: number, mode: Mode): Pt {
  if (mode === "portrait") {
    // Two bands: above and below the text. Cards swap bands every stage.
    const top = i % 2 === s % 2;
    const rank = Math.floor(i / 2); // 0..2 within a band
    const jitter = ((i * 37 + s * 13) % 7) - 3; // -3..3 vw
    const depth = top ? 31 + (rank % 2) * 5 : 31 + ((rank + 1) % 2) * 5; // zig-zag, in svh
    return {
      x: (rank - 1) * 30 + jitter,
      y: (top ? -1 : 1) * depth,
      r: ((i * 53 + s * 31) % 30) - 15,
      s: 1,
    };
  }
  // Wide: ellipse around the headline, rotating each stage.
  const a = (i / C) * Math.PI * 2 + s * 0.55 + 0.35;
  const k = 0.86 + ((i * 37) % 25) / 100; // slight radius variation per card
  return {
    x: Math.cos(a) * 40 * k,
    y: Math.sin(a) * 31 * k,
    r: ((i * 53 + s * 31) % 30) - 15,
    s: 1,
  };
}

const stack = (i: number): Pt => ({
  x: (i - (C - 1) / 2) * 0.7,
  y: (i - (C - 1) / 2) * -0.8,
  r: (i - (C - 1) / 2) * 4,
  s: 0.82,
});

// Keyframes for one card across the full scroll: scatter, stack, scatter, stack, ...
function keyframes(i: number, mode: Mode) {
  const input: number[] = [];
  const pts: Pt[] = [];
  for (let s = 0; s < N; s++) {
    const p = s / (N - 1);
    input.push(p);
    pts.push(scatter(i, s, mode));
    if (s < N - 1) {
      input.push((p + (s + 1) / (N - 1)) / 2);
      pts.push(stack(i));
    }
  }
  return { input, pts };
}

// Card width is capped by width and height so it never dominates a short or narrow screen.
// The portrait minimum is 64px so the longest label word ("Explainer") still fits.
const CARD_W: Record<Mode, string> = {
  portrait: "clamp(64px, min(19vw, 13svh), 150px)",
  wide: "clamp(64px, min(13vw, 24svh), 170px)",
};

function Card({ i, mode, progress }: { i: number; mode: Mode; progress: MotionValue<number> }) {
  const { input, pts } = keyframes(i, mode);
  const x = useTransform(progress, input, pts.map((p) => `${p.x}vw`));
  const y = useTransform(progress, input, pts.map((p) => `${p.y}svh`));
  const rotate = useTransform(progress, input, pts.map((p) => p.r));
  const scale = useTransform(progress, input, pts.map((p) => p.s));
  const card = CARDS[i];

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{ x, y, rotate, scale, zIndex: i }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div
        className="relative -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-black/5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)] sm:rounded-2xl"
        style={{
          width: CARD_W[mode],
          aspectRatio: "4 / 5",
          background: `linear-gradient(160deg, ${card.from}, ${card.to})`,
        }}
      >
        {card.src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={card.src} alt="" className="h-full w-full object-cover" loading="lazy" />
        )}

        {/* Label: visible at every size. Tiny type on phones, a soft fade keeps it readable. */}
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-1.5 pb-1.5 pt-7 sm:px-2 sm:pb-2">
          <span className="micro block text-balance leading-[1.15] !text-white/90 !text-[0.5625rem] !tracking-[0.06em] sm:!text-[0.6875rem] sm:!tracking-[0.2em]">
            {card.label}
          </span>
        </span>
      </div>
    </motion.div>
  );
}

function Word({
  i,
  progress,
  active,
}: {
  i: number;
  progress: MotionValue<number>;
  active: boolean;
}) {
  const p = i / (N - 1);
  const w = 0.5 / (N - 1); // distance from a stage to the stack moment
  const first = i === 0;
  const last = i === N - 1;
  // Ranges must stay inside 0..1 and be increasing, so the first and last
  // stages skip their fade-in / fade-out edge.
  const input = first
    ? [0, p + w * 0.55, p + w]
    : last
      ? [p - w, p - w * 0.55, 1]
      : [p - w, p - w * 0.55, p + w * 0.55, p + w];
  const opacityOut = first ? [1, 1, 0] : last ? [0, 1, 1] : [0, 1, 1, 0];
  const yOut = first ? [0, 0, -28] : last ? [28, 0, 0] : [28, 0, 0, -28];
  const opacity = useTransform(progress, input, opacityOut);
  const y = useTransform(progress, input, yOut);

  return (
    <motion.div
      style={{ opacity, y }}
      aria-hidden={!active}
      className={`absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center md:px-10 ${
        active ? "" : "pointer-events-none"
      }`}
    >
      <h2 className={HEADING}>{STAGES[i].title}</h2>
      <p className="mx-auto mt-4 max-w-[19rem] text-base leading-relaxed text-fg-2 sm:max-w-md md:mt-7 md:text-lg [@media(max-height:560px)]:mt-3">
        {STAGES[i].body}
      </p>
      {last && (
        <div className="mt-7 flex w-full max-w-[16rem] flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center md:mt-8 [@media(max-height:560px)]:mt-4">
          <Button href="/work">Explore our work</Button>
          <Button href="/contact" variant="outline">Start a project ↗</Button>
        </div>
      )}
    </motion.div>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const mode = useLayoutMode();
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) =>
    setActive(Math.min(N - 1, Math.max(0, Math.round(v * (N - 1))))),
  );

  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Reduced motion: a single static screen, no pinning.
  if (reduce) {
    return (
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center bg-bg-3 px-6 pb-16 pt-28 text-center md:px-10 md:pt-32">
        <p className="micro !text-fg-2">Independent creative production studio</p>
        <h1 className={`${HEADING} mt-6 max-w-4xl`}>We make brands impossible to ignore.</h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-fg-2 md:mt-8 md:text-lg">
          {STAGES.map((s) => s.title).join(", ")}.
        </p>
        <div className="mt-8 flex w-full max-w-[16rem] flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
          <Button href="/work">Explore our work</Button>
          <Button href="/contact" variant="outline">Start a project ↗</Button>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative bg-bg-3" style={{ height: `${(N + 1) * 100}svh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <h1 className="sr-only">We make brands impossible to ignore.</h1>

        {/* Cards (rendered once the layout is known, so there is no hydration jump) */}
        {mode &&
          CARDS.map((_, i) => <Card key={`${mode}-${i}`} i={i} mode={mode} progress={scrollYProgress} />)}

        {/* Headlines */}
        {STAGES.map((_, i) => (
          <Word key={i} i={i} progress={scrollYProgress} active={active === i} />
        ))}

        {/* Top label: hidden on short landscape screens, where it would collide with the headline */}
        <p className="micro absolute inset-x-0 top-20 z-20 px-6 text-center !text-fg-2 sm:top-24 md:top-28 [@media(max-height:560px)]:hidden">
          Independent creative production studio
        </p>

        {/* Bottom: scroll hint, stage list / counter, progress */}
        <div className="absolute inset-x-0 bottom-0 z-20">
          <motion.div
            style={{ opacity: hintOpacity }}
            className="mb-4 flex flex-col items-center gap-3 [@media(max-height:560px)]:hidden"
          >
            <span className="micro">Scroll</span>
            <span className="relative block h-10 w-px overflow-hidden bg-black/15">
              <motion.span
                className="absolute inset-x-0 top-0 block h-1/2 bg-black"
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </motion.div>

          <div className="container-x pb-[max(1.5rem,env(safe-area-inset-bottom))] md:pb-8">
            {/* sm and up: full stage list */}
            <ul
              className="micro hidden flex-wrap items-center justify-center gap-x-6 gap-y-1 sm:flex md:gap-x-10"
              aria-label="What we do"
            >
              {STAGES.map((s, i) => (
                <li key={s.title} className={`transition-opacity duration-300 ${active === i ? "opacity-100" : "opacity-40"}`}>
                  {s.title}
                </li>
              ))}
            </ul>
            {/* phones: compact counter, since four labels don't fit */}
            <p className="micro text-center sm:hidden" aria-hidden="true">
              {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </p>

            <div className="mt-3 h-0.5 w-full bg-black/10 sm:mt-4">
              <motion.div className="h-0.5 origin-left bg-[#ff5a1f]" style={{ scaleX: barScale }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}