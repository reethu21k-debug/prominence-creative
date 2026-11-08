"use client";
import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Button from "@/components/ui/Button";
import SectionLabel from "@/components/ui/SectionLabel";
import MediaPlaceholder from "@/components/ui/MediaPlaceholder";

/**
 * Scroll-driven intro (pinned). Same sequence as before:
 *   words fill grey -> ink, the yellow pill wipes in, chips pop in,
 *   then the copy, buttons and media arrive.
 *
 * UI / UX changes:
 *  - Headline spans the full width and breaks into two clean lines on desktop.
 *  - Bottom row is a 3-column grid: copy + buttons | chips | media, under a hairline.
 *  - Sizes are capped by viewport height (svh) so nothing is clipped on short screens.
 *  - Buttons are inert (not focusable or clickable) until they have appeared.
 *  - Scroll hint that fades out, plus a thin progress bar.
 *  - Mobile drops the second paragraph and the media tile so the stage fits one screen.
 */

const GREY = "#c9c9c6";
const INK = "#0a0a0a";
const YELLOW = "#ffd23f";
const ACCENT = "#ff5a1f";

const WORDS = ["Good", "content", "gets", "attention.", "Great", "content", "builds"];
const BREAK_AFTER = 3; // line break after "attention." on desktop
const W_START = 0.04;
const W_STEP = 0.06;
const W_LEN = 0.07;
const AFTER_WORDS = W_START + (WORDS.length - 1) * W_STEP + W_LEN; // ~0.47

function Word({ text, i, progress }: { text: string; i: number; progress: MotionValue<number> }) {
  const start = W_START + i * W_STEP;
  const color = useTransform(progress, [start, start + W_LEN], [GREY, INK]);
  return (
    <>
      <motion.span style={{ color }} className="mr-[0.22em] inline-block">
        {text}
      </motion.span>
      {i === BREAK_AFTER && <br className="hidden md:block" />}
    </>
  );
}

// Words that scroll through the pill. Each one completes "Great content builds ...".
// Keep the group clearly wider than the pill so the loop never shows a gap.
const TICKER_GROUP = ["brands.", "campaigns.", "launches.", "stories.", "products.", "audiences."];

function Pill({ progress }: { progress: MotionValue<number> }) {
  const a = AFTER_WORDS;
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);
  const clip = useTransform(progress, [a, a + 0.14], ["inset(0 100% 0 0 round 999px)", "inset(0 0% 0 0 round 999px)"]);

  // The track holds two identical groups; sliding it by -50% loops with no jump.
  const group = (key: string, hidden?: boolean) => (
    <span key={key} className="flex shrink-0" aria-hidden={hidden || undefined}>
      {TICKER_GROUP.map((t, i) => (
        <span key={i} className="pr-[0.7em]">{t}</span>
      ))}
    </span>
  );

  return (
    <motion.span
      ref={ref}
      style={{ clipPath: clip, background: YELLOW, color: INK }}
      className="inline-block w-[6.4em] whitespace-nowrap rounded-full pb-[0.08em] pl-[0.45em] text-left align-baseline"
    >
      <motion.span
        className="inline-flex"
        animate={inView ? { x: ["0%", "-50%"] } : { x: "0%" }}
        transition={inView ? { duration: 32, ease: "linear", repeat: Infinity } : { duration: 0 }}
      >
        {group("a")}
        {group("b", true)}
      </motion.span>
    </motion.span>
  );
}

function Fade({
  progress,
  range,
  className,
  children,
  from = 18,
  scaleFrom,
  inertUntil,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  className?: string;
  children: React.ReactNode;
  from?: number;
  scaleFrom?: number;
  /** While scroll progress is below this, the content cannot be focused or clicked. */
  inertUntil?: number;
}) {
  const el = useRef<HTMLDivElement>(null);
  const opacity = useTransform(progress, range, [0, 1]);
  const y = useTransform(progress, range, [from, 0]);
  const scale = useTransform(progress, range, [scaleFrom ?? 1, 1]);

  useEffect(() => {
    if (inertUntil !== undefined) el.current?.toggleAttribute("inert", progress.get() < inertUntil);
  }, [inertUntil, progress]);
  useMotionValueEvent(progress, "change", (v) => {
    if (inertUntil !== undefined) el.current?.toggleAttribute("inert", v < inertUntil);
  });

  return (
    <motion.div ref={el} style={{ opacity, y, scale }} className={className}>
      {children}
    </motion.div>
  );
}

const Chips = () => (
  <div className="flex items-center gap-3" aria-hidden="true">
    <span className="flex h-[clamp(72px,8vw,112px)] w-[clamp(72px,8vw,112px)] items-center justify-center rounded-full bg-bg-2">
      <span className="flex h-[42%] w-[42%] items-center justify-center rounded-[28%]" style={{ background: ACCENT }}>
        <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" fill="#fff">
          <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
        </svg>
      </span>
    </span>
    <span
      className="flex h-[clamp(72px,8vw,112px)] w-[clamp(72px,8vw,112px)] items-center justify-center rounded-full p-3 text-center text-xs font-medium leading-tight md:text-sm"
      style={{ background: YELLOW, color: INK }}
    >
      Idea to final frame
    </span>
  </div>
);

const Copy = () => (
  <div className="max-w-md space-y-3 text-sm leading-relaxed text-fg-2 md:space-y-4 md:text-base">
    <p>
      Prominence Creative is a creative production studio helping businesses, founders and creators transform ideas
      into impactful visual content.
    </p>
    <p className="hidden sm:block">
      We bring together creative thinking, professional production and thoughtful editing to create content that
      connects with audiences and strengthens brands.
    </p>
  </div>
);

const Buttons = () => (
  <div className="flex flex-col gap-3 sm:flex-row">
    <Button href="/work">See our work</Button>
    <Button href="/contact" variant="outline">Start a project ↗</Button>
  </div>
);

// Headline size is capped by both width and height so it never overflows short screens.
const HEADING = "h-display text-[clamp(2.2rem,min(5.6vw,10.5svh),5.5rem)]";
const MEDIA = "h-[26svh] w-full";

export default function Intro() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const hintOpacity = useTransform(p, [0, 0.06], [1, 0]);
  const barScale = useTransform(p, [0, 1], [0, 1]);

  // Reduced motion: everything visible, no pinning.
  if (reduce) {
    return (
      <section className="bg-bg py-28 md:py-40">
        <div className="container-x">
          <SectionLabel>Who we are</SectionLabel>
          <h2 className={`${HEADING} mt-8`}>
            Good content gets attention. <br className="hidden md:block" />
            Great content builds{" "}
            <span className="rounded-full px-[0.45em] pb-[0.08em]" style={{ background: YELLOW }}>brands.</span>
          </h2>
          <div className="mt-12 grid gap-8 border-t border-line pt-8 md:grid-cols-12 md:items-end">
            <div className="space-y-8 md:col-span-5">
              <Copy />
              <Buttons />
            </div>
            <div className="md:col-span-3"><Chips /></div>
            <div className="hidden md:col-span-4 md:block">
              <MediaPlaceholder label="Production photograph or video" className={MEDIA} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative bg-bg" style={{ height: "320svh" }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pb-14 pt-20 md:pt-24">
        <div className="container-x">
          <SectionLabel>Who we are</SectionLabel>

          <h2 className={`${HEADING} mt-5 md:mt-7`} aria-label="Good content gets attention. Great content builds brands.">
            <span aria-hidden="true">
              {WORDS.map((w, i) => (
                <Word key={i} text={w} i={i} progress={p} />
              ))}
              <Pill progress={p} />
            </span>
          </h2>

          {/* Bottom row: copy + buttons | chips | media */}
          <div className="mt-6 grid gap-6 border-t border-line pt-6 md:mt-10 md:grid-cols-12 md:items-end md:gap-8 md:pt-8">
            <div className="order-2 space-y-6 md:order-1 md:col-span-5">
              <Fade progress={p} range={[0.7, 0.8]}>
                <Copy />
              </Fade>
              <Fade progress={p} range={[0.78, 0.88]} inertUntil={0.8}>
                <Buttons />
              </Fade>
            </div>

            <Fade
              progress={p}
              range={[0.6, 0.7]}
              scaleFrom={0.7}
              from={10}
              className="order-1 origin-left md:order-2 md:col-span-3"
            >
              <Chips />
            </Fade>

            <Fade
              progress={p}
              range={[0.55, 0.75]}
              from={40}
              scaleFrom={0.9}
              className="order-3 hidden md:col-span-4 md:block"
            >
              <MediaPlaceholder label="Production photograph or video" className={MEDIA} />
            </Fade>
          </div>
        </div>

        {/* Scroll hint and progress */}
        <motion.p style={{ opacity: hintOpacity }} className="micro container-x absolute inset-x-0 bottom-6">
          Keep scrolling
        </motion.p>
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-black/10">
          <motion.div className="h-0.5 origin-left" style={{ scaleX: barScale, background: ACCENT }} />
        </div>
      </div>
    </section>
  );
}