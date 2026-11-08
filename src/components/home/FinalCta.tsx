"use client";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import SectionLabel from "@/components/ui/SectionLabel";

const YELLOW = "#ffd23f";
const INK = "#0a0a0a";
const ACCENT = "#ff5a1f";
const EASE = [0.22, 1, 0.36, 1] as const;

/** Same chips as the Intro, so the page opens and closes with the same marks. */
const Chips = () => {
  const reduce = useReducedMotion();
  const size = "h-[clamp(72px,8vw,112px)] w-[clamp(72px,8vw,112px)]";
  const pop = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, scale: 0.7 },
          whileInView: { opacity: 1, scale: 1 },
          viewport: { once: true, margin: "-10% 0px" },
          transition: { duration: 0.6, ease: EASE, delay },
        };

  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <motion.span {...pop(0.45)} className={`flex items-center justify-center rounded-full bg-white shadow-[0_10px_30px_-14px_rgba(0,0,0,0.18)] ${size}`}>
        <span className="flex h-[42%] w-[42%] items-center justify-center rounded-[28%]" style={{ background: ACCENT }}>
          <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" fill="#fff">
            <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
          </svg>
        </span>
      </motion.span>
      <motion.span
        {...pop(0.55)}
        className={`flex items-center justify-center rounded-full p-3 text-center text-xs font-medium leading-tight md:text-sm ${size}`}
        style={{ background: YELLOW, color: INK }}
      >
        Idea to final frame
      </motion.span>
    </div>
  );
};

export default function FinalCta() {
  const reduce = useReducedMotion();

  const pillMotion = reduce
    ? {}
    : {
        initial: { clipPath: "inset(0 100% 0 0 round 999px)" },
        whileInView: { clipPath: "inset(0 0% 0 0 round 999px)" },
        viewport: { once: true, margin: "-15% 0px" },
        transition: { duration: 0.9, ease: EASE, delay: 0.25 },
      };

  return (
    <section className="bg-bg py-20 md:py-32">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[2rem] bg-bg-2 px-6 py-14 ring-1 ring-black/5 md:px-14 md:py-24">
          <Reveal>
            <SectionLabel>Let&apos;s talk</SectionLabel>

            {/* Matches the Hero headline scale so the page opens and closes at the same size. */}
            <h2
              className="h-display mt-6 text-[clamp(2.5rem,11vw,4.25rem)] md:mt-8 md:text-[clamp(4rem,8.5vw,8rem)]"
              style={{ color: INK }}
            >
              Let&apos;s create
              <br />
              <motion.span
                {...pillMotion}
                className="mr-[0.15em] inline-block rounded-full px-[0.4em] pb-[0.08em]"
                style={{ background: YELLOW }}
              >
                something
              </motion.span>
              <br className="md:hidden" />
              remarkable.
            </h2>
          </Reveal>

          {/* Bottom row: copy | chips | buttons — same structure as the Intro */}
          <Reveal
            delay={0.15}
            className="mt-12 grid gap-8 border-t border-line pt-8 md:mt-20 md:grid-cols-12 md:items-end md:gap-8 md:pt-10"
          >
            <p className="max-w-md text-base leading-relaxed text-fg-2 md:col-span-5 md:text-lg">
              Have an idea, campaign or brand that deserves better content? Let&apos;s bring it to life.
            </p>

            <div className="md:col-span-3">
              <Chips />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row md:col-span-4 md:justify-end">
              <Button href="/contact">Start a project ↗</Button>
              <Button href="/work" variant="outline">See our work</Button>
            </div>
          </Reveal>

          {/* Quiet orange accent in the corner, echoing the progress bars above */}
          <span
            aria-hidden="true"
            className="absolute right-6 top-6 h-2.5 w-2.5 rounded-full md:right-10 md:top-10 md:h-3 md:w-3"
            style={{ background: ACCENT }}
          />
        </div>
      </div>
    </section>
  );
}