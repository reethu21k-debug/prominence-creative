"use client";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Button from "@/components/ui/Button";

const DISCIPLINES = ["Product shoots", "Ad creatives", "AI video", "Social content"];
// Optional media. When unset, no request is made for a file that does not exist.
const VIDEO = process.env.NEXT_PUBLIC_HERO_VIDEO_URL;
const POSTER = process.env.NEXT_PUBLIC_HERO_POSTER_URL;

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Content drifts up and fades slightly as the visitor scrolls away from the hero.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);

  useEffect(() => {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) videoRef.current?.pause();
  }, [reduce]);

  const scrollNext = () => window.scrollBy({ top: window.innerHeight * 0.95, behavior: reduce ? "auto" : "smooth" });

  const lineMotion = (delay: number) => ({
    initial: reduce ? false : { y: "105%" },
    animate: { y: 0 },
    transition: { duration: 1, delay, ease: EASE },
  });

  return (
    <section ref={sectionRef} className="relative flex min-h-[100svh] flex-col overflow-hidden bg-bg-3">
      {/* Background: optional video, soft glow and vignette */}
      {VIDEO && (
        <>
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay muted loop playsInline preload="metadata" poster={POSTER || undefined} aria-hidden="true"
          >
            <source src={VIDEO} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/65" />
        </>
      )}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0) 65%)" }}
        animate={reduce ? undefined : { opacity: [0.55, 1, 0.55], scale: [1, 1.08, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)" }}
      />

      {/* Centered content */}
      <motion.div
        style={reduce ? undefined : { opacity, y }}
        className="container-x relative flex flex-1 flex-col items-center justify-center pb-10 pt-32 text-center md:pt-36"
      >
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="micro flex items-center gap-4 !text-fg-2"
        >
          <span className="block h-px w-6 bg-white/30 md:w-10" aria-hidden="true" />
          Independent creative production studio
          <span className="block h-px w-6 bg-white/30 md:w-10" aria-hidden="true" />
        </motion.p>

        {/* Two lines on desktop. On very narrow phones a line may wrap, which is fine. */}
        <h1
          className="h-display mt-6 text-balance text-[clamp(2.4rem,10.5vw,4.5rem)] md:mt-8 md:text-[clamp(3rem,min(6.6vw,13svh),7.5rem)]"
          aria-label="We make brands impossible to ignore."
        >
          <span className="block overflow-hidden pb-[0.08em]" aria-hidden="true">
            <motion.span className="block" {...lineMotion(0.35)}>We make brands</motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.12em]" aria-hidden="true">
            <motion.span className="block" {...lineMotion(0.5)}>
              <span className="font-serif font-light italic normal-case tracking-[-0.02em] text-[1.1em]">Impossible</span>{" "}
              to ignore.
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8, ease: EASE }}
          className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-fg-2 md:mt-10 md:text-lg"
        >
          From the first idea to the final frame, we create powerful visual experiences that help brands capture attention and leave a lasting impression.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.8, ease: EASE }}
          className="mt-8 flex w-full max-w-xs flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center md:mt-10"
        >
          <Button href="/work">Explore our work</Button>
          <Button href="/contact" variant="outline">Start a project ↗</Button>
        </motion.div>
      </motion.div>

      {/* Bottom bar sits below the content (not on top of it) */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="relative"
      >
        <div className="container-x flex flex-col items-center gap-4 pb-6 md:pb-8">
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Scroll to the next section"
            className="group flex flex-col items-center gap-3 focus-visible:outline-none"
          >
            <span className="micro transition-colors group-hover:!text-white">Scroll</span>
            <span className="relative block h-10 w-px overflow-hidden bg-white/20">
              <motion.span
                className="absolute inset-x-0 top-0 block h-1/2 bg-white"
                animate={reduce ? undefined : { y: ["-100%", "200%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </button>
          <ul className="micro hidden w-full items-center justify-center gap-x-6 border-t border-white/15 pt-5 sm:flex md:gap-x-10" aria-label="What we do">
            {DISCIPLINES.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}