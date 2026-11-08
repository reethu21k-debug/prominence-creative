"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, Clapperboard, Scissors, Send, Sparkles, type LucideIcon } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { PROBLEMS, STAGES } from "@/lib/content";

/**
 * The difference.
 * Top: headline + problems list (unchanged content).
 * Below: the production steps, scroll-driven. The section pins to the screen and
 * scrolling down slides the cards sideways, one step after another. The numbered
 * timeline follows, and the arrows / pills jump to a step.
 * Reduced motion: a plain grid of cards, no pinning.
 */

const YELLOW = "#ffd23f";
const INK = "#0a0a0a";
const N = STAGES.length;

// One icon per step, in order. Change freely.
const ICONS: LucideIcon[] = [Sparkles, Clapperboard, Scissors, Send];

// Share of the scroll (0..1) where the cards start and finish moving.
const START = 0.06;
const END = 0.94;

function StepCard({
  s,
  index,
  on,
  className = "",
}: {
  s: (typeof STAGES)[number];
  index: number;
  on: boolean;
  className?: string;
}) {
  const Icon = ICONS[index % ICONS.length];
  return (
    <li
      aria-current={on ? "step" : undefined}
      className={`flex flex-col justify-between rounded-3xl bg-white p-6 transition-all duration-500 md:p-8 ${
        on
          ? "scale-100 opacity-100 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.4)]"
          : "scale-[0.97] opacity-60 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.2)]"
      } ${className}`}
    >
      <span
        className="font-display font-medium leading-none tracking-[-0.05em] transition-colors duration-500"
        style={{ fontSize: "clamp(3rem,8svh,5rem)", color: on ? INK : "rgba(10,10,10,0.15)" }}
      >
        {s.n}
      </span>

      <div>
        <span
          aria-hidden="true"
          className="mb-5 block h-1.5 rounded-full transition-all duration-500"
          style={{ width: on ? "3.5rem" : "1.5rem", background: on ? YELLOW : "rgba(10,10,10,0.12)" }}
        />
        <p className="font-display text-2xl font-medium tracking-[-0.035em] md:text-3xl">{s.t}</p>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-fg-2 md:text-base">{s.d}</p>
      </div>

      <span
        aria-hidden="true"
        className="mt-6 flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-500"
        style={{ background: on ? YELLOW : "#f5f5f4", color: INK }}
      >
        <Icon size={20} />
      </span>
    </li>
  );
}

function Top() {
  return (
    <div className="container-x">
      <div className="grid gap-16 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <SectionLabel>04 / The difference</SectionLabel>
          <h2 className="h-display mt-8 text-[clamp(2rem,4.6vw,4.25rem)]">
            Creating content shouldn&apos;t feel like a full-time job.
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-5 md:pt-10">
          <ul className="divide-y divide-line border-y border-line">
            {PROBLEMS.map((p) => (
              <li key={p} className="py-4 text-base text-fg-2">{p}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  );
}

const StepsTitle = () => (
  <h3 className="h-display text-[clamp(1.6rem,min(4vw,6.8svh),3.25rem)]">
    One creative partner.
    <span className="block text-muted">The complete production process.</span>
  </h3>
);

export default function Difference() {
  const reduce = useReducedMotion();
  const area = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: area, offset: ["start start", "end end"] });

  // How far the track has to travel so the last card ends fully in view.
  useEffect(() => {
    const measure = () => {
      const t = track.current;
      if (!t) return;
      setShift(Math.max(0, t.scrollWidth - document.documentElement.clientWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const x = useTransform(scrollYProgress, [START, END], [0, -shift]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!Number.isFinite(v)) return;
    const t = Math.min(1, Math.max(0, (v - START) / (END - START)));
    setActive(Math.round(t * (N - 1)));
  });

  // Jump the page to the scroll position of step i.
  const goTo = (i: number) => {
    const el = area.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const scrollable = el.offsetHeight - window.innerHeight;
    const t = START + (i / Math.max(1, N - 1)) * (END - START);
    window.scrollTo({ top: top + t * scrollable, behavior: "smooth" });
  };

  // Reduced motion: simple grid, no pinning.
  if (reduce) {
    return (
      <section className="bg-bg-2 py-28 md:py-44">
        <Top />
        <div className="container-x mt-24">
          <StepsTitle />
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STAGES.map((s, i) => (
              <StepCard key={s.n} s={s} index={i} on className="min-h-[18rem]" />
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-bg-2 pt-28 md:pt-44">
      <Top />

      {/* Pinned steps */}
      <div ref={area} className="relative mt-16 md:mt-24" style={{ height: `calc(100svh + ${N * 55}svh)` }}>
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center gap-[clamp(1rem,3svh,2rem)] overflow-hidden pb-6 pt-20">
          {/* Title + arrows */}
          <div className="container-x flex items-end justify-between gap-6">
            <StepsTitle />
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => goTo(Math.max(0, active - 1))}
                disabled={active === 0}
                aria-label="Previous step"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.3)] transition-opacity disabled:opacity-40 md:h-12 md:w-12"
              >
                <ArrowLeft size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => goTo(Math.min(N - 1, active + 1))}
                disabled={active === N - 1}
                aria-label="Next step"
                className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-opacity disabled:opacity-40 md:h-12 md:w-12"
                style={{ background: INK }}
              >
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Cards slide sideways as you scroll */}
          <motion.div
            ref={track}
            style={{ x, paddingInline: "var(--g)" }}
            className="flex w-max gap-4 [--g:max(1.5rem,calc((100vw_-_1440px)/2_+_1.5rem))] md:[--g:max(2.5rem,calc((100vw_-_1440px)/2_+_2.5rem))]"
          >
            <ol className="contents">
              {STAGES.map((s, i) => (
                <StepCard
                  key={s.n}
                  s={s}
                  index={i}
                  on={active === i}
                  className="h-[min(50svh,27rem)] w-[min(82vw,30rem)] shrink-0"
                />
              ))}
            </ol>
          </motion.div>

          {/* Timeline */}
          <div className="container-x">
            <div className="relative">
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-black/10" aria-hidden="true" />
              <div
                className="absolute left-0 top-1/2 h-px -translate-y-1/2 transition-[width] duration-500"
                style={{ width: `${(active / Math.max(1, N - 1)) * 100}%`, background: INK }}
                aria-hidden="true"
              />
              <ul className="relative flex justify-between">
                {STAGES.map((s, i) => {
                  const on = active === i;
                  return (
                    <li key={s.n}>
                      <button
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`Go to step ${s.n}: ${s.t}`}
                        aria-current={on ? "step" : undefined}
                        className="flex h-9 min-w-11 items-center justify-center rounded-lg px-3 text-xs font-medium tracking-wider shadow-[0_6px_18px_-10px_rgba(0,0,0,0.35)] transition-colors duration-300"
                        style={on ? { background: INK, color: "#fff" } : { background: "#fff", color: INK }}
                      >
                        {s.n}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}