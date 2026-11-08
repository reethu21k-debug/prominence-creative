"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import { SERVICES } from "@/lib/content";

/**
 * Services.
 *
 * Two layouts, switched with CSS only (no hydration flash):
 *   - Pinned stage: viewport >= 1024px wide AND >= 640px tall. A soft card where scrolling
 *     steps through the services (tapping a pill jumps to it).
 *   - List: everything else (phones, tablets, short landscape screens).
 *       phones: single-column tap-to-open pills
 *       md+:    two columns, sticky heading on the left, pills on the right
 *
 * Reduced motion always uses the list layout.
 *
 * NOTE: the media-query classes are written out in full on purpose. Tailwind only generates
 * CSS for classes it can find as complete strings in the source.
 */

type Service = (typeof SERVICES)[number];

const N = SERVICES.length;
const YELLOW = "#ffd23f";
const INK = "#0a0a0a";
const EASE = [0.22, 1, 0.36, 1] as const;

// Add your real work here, keyed by service slug. Without an entry, a coloured tile is shown.
//   "product-shoot": { src: "/media/product.jpg" },
//   "ai-video":      { src: "/media/ai.mp4", video: true },
const MEDIA: Record<string, { src: string; video?: boolean }> = {};

const PALETTE: [string, string][] = [
  ["#ff7a45", "#7a1d0c"],
  ["#4aa8ff", "#0c2a5c"],
  ["#9aa7ff", "#1d1f5c"],
  ["#e58bd0", "#4a1646"],
  ["#43d17a", "#0b4a2a"],
];

const LIST_SIZE = "text-[clamp(2.25rem,9vw,3.5rem)] md:text-[clamp(2rem,4.6vw,3.25rem)]";

function Screen({ s, index, className = "" }: { s: Service; index: number; className?: string }) {
  const media = MEDIA[s.slug];
  const [from, to] = PALETTE[index % PALETTE.length];
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(160deg, ${from}, ${to})` }}
    >
      {media &&
        (media.video ? (
          <video src={media.src} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={media.src} alt={s.title} className="absolute inset-0 h-full w-full object-cover" />
        ))}
      {!media && (
        <>
          <span className="micro absolute left-4 top-4 !text-white/80">{s.title}</span>
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-4 font-display font-medium leading-none tracking-[-0.05em] text-white/90"
            style={{ fontSize: "clamp(2.5rem,8svh,6rem)" }}
          >
            {s.n}
          </span>
        </>
      )}
    </div>
  );
}

function PlusIcon({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300"
      style={{ background: open ? YELLOW : "#f5f5f4", color: INK }}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 transition-transform duration-300"
        style={{ transform: open ? "rotate(45deg)" : "none" }}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
    </span>
  );
}

function Pill({
  s,
  index,
  open,
  onSelect,
  withMedia,
  idPrefix,
}: {
  s: Service;
  index: number;
  open: boolean;
  onSelect: () => void;
  withMedia?: boolean;
  /** Keeps ids unique when the list and pinned layouts are both in the DOM. */
  idPrefix: string;
}) {
  const panelId = `${idPrefix}-service-${s.slug}`;
  return (
    <div
      className={`bg-white shadow-[0_10px_30px_-14px_rgba(0,0,0,0.18)] transition-[border-radius] duration-500 ${
        open ? "rounded-[1.5rem]" : "rounded-full"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-4 px-5 text-left"
        style={{ paddingBlock: "clamp(0.45rem,1.5svh,0.85rem)" }}
      >
        <span className="flex items-baseline gap-4">
          <span className="micro">{s.n}</span>
          <span className="font-display font-medium tracking-[-0.03em]" style={{ fontSize: "clamp(1rem,2.4svh,1.3rem)" }}>
            {s.title}
          </span>
        </span>
        <PlusIcon open={open} />
      </button>

      <div
        id={panelId}
        role="region"
        aria-label={s.title}
        className="grid transition-[grid-template-rows] duration-500"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-4">
            {/* In the pinned card, long descriptions are clamped on shorter screens so the column can't overflow */}
            <p
              className={`max-w-md text-sm leading-relaxed text-fg-2 ${
                withMedia ? "" : "[@media(max-height:760px)]:line-clamp-3"
              }`}
            >
              {s.description}
            </p>

            {withMedia && (
              <>
                <Screen s={s} index={index} className="mt-4 aspect-[16/10] w-full rounded-2xl" />
                <ul className="mt-3 flex flex-wrap gap-2">
                  {s.deliverables.map((d) => (
                    <li key={d} className="rounded-full bg-bg-2 px-3 py-1.5 text-xs text-fg-2">{d}</li>
                  ))}
                </ul>
              </>
            )}

            <Link
              href={`/services/${s.slug}`}
              tabIndex={open ? 0 : -1}
              className="micro relative mt-3 inline-block border-b border-black/40 pb-1 !text-fg transition-colors after:absolute after:-inset-x-3 after:-inset-y-3 after:content-[''] hover:border-black"
            >
              Explore service ↗
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stage({ s, index }: { s: Service; index: number }) {
  return (
    <motion.div
      className="absolute inset-0"
      initial="hidden"
      animate="show"
      exit="leave"
      variants={{ hidden: {}, show: {}, leave: {} }}
    >
      {/* Tablet: sized from the pane height so it never collides with the chips */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 40, scale: 0.96 },
          show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: EASE } },
          leave: { opacity: 0, y: -24, transition: { duration: 0.25 } },
        }}
        className="absolute right-0 top-0 aspect-[16/10] h-[62%] rounded-[1.4rem] bg-[#0a0a0a] p-[6px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)]"
      >
        <Screen s={s} index={index} className="h-full w-full rounded-[1rem]" />
      </motion.div>

      {/* Phone */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 60, scale: 0.95 },
          show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: EASE, delay: 0.1 } },
          leave: { opacity: 0, y: -24, transition: { duration: 0.25 } },
        }}
        className="absolute left-[3%] top-[24%] aspect-[9/18.5] h-[68%] rounded-[2rem] bg-[#0a0a0a] p-[5px] shadow-[0_40px_80px_-24px_rgba(0,0,0,0.55)]"
      >
        <div className="relative h-full w-full">
          <Screen s={s} index={index} className="h-full w-full rounded-[1.6rem]" />
          <span aria-hidden="true" className="absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-black/80" />
        </div>
      </motion.div>

      {/* Deliverables as floating chips */}
      <ul className="absolute bottom-0 right-0 flex max-w-[66%] flex-wrap justify-end gap-2">
        {s.deliverables.slice(0, 4).map((d, i) => (
          <motion.li
            key={d}
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE, delay: 0.3 + i * 0.07 } },
              leave: { opacity: 0, transition: { duration: 0.15 } },
            }}
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)]"
          >
            <span className="h-2 w-2 rounded-full ring-1 ring-black/15" style={{ background: YELLOW }} />
            {d}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

const Header = ({ size, tight }: { size: string; tight?: boolean }) => (
  <>
    <SectionLabel>03 / Our capabilities</SectionLabel>
    <h2 className={`h-display ${tight ? "mt-3" : "mt-5 md:mt-6"} ${size}`}>
      From concept
      <br />
      to final frame.
    </h2>
  </>
);

export default function Services() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [openList, setOpenList] = useState(0); // -1 = all closed

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!Number.isFinite(v)) return; // the pinned block is display:none in list layout
    setActive(Math.min(N - 1, Math.max(0, Math.floor(v * N))));
  });

  // Tapping a pill scrolls to the middle of that service's slice (pinned layout only).
  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const scrollable = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((i + 0.5) / N) * scrollable, behavior: "smooth" });
  };

  // List layout: phones = one column; md+ = sticky heading left, pills right.
  const listLayout = (
    <div className="container-x md:grid md:grid-cols-12 md:gap-10 lg:gap-16">
      <div className="md:sticky md:top-28 md:col-span-5 md:self-start">
        <Header size={LIST_SIZE} />
      </div>
      <div className="mt-10 space-y-3 md:col-span-7 md:mt-0">
        {SERVICES.map((s, i) => (
          <Pill
            key={s.slug}
            s={s}
            index={i}
            idPrefix="list"
            open={openList === i}
            onSelect={() => setOpenList(openList === i ? -1 : i)}
            withMedia
          />
        ))}
      </div>
    </div>
  );

  // Reduced motion: list layout, no pinning.
  if (reduce) {
    return <section className="bg-bg py-24 md:py-32">{listLayout}</section>;
  }

  const current = SERVICES[active];

  return (
    <section className="bg-bg">
      {/* List layout: phones, tablets, short screens */}
      <div className="py-24 md:py-32 [@media(min-width:1024px)_and_(min-height:640px)]:hidden">
        {listLayout}
      </div>

      {/* Pinned stage: >= 1024px wide and >= 640px tall */}
      <div
        ref={ref}
        className="relative hidden [@media(min-width:1024px)_and_(min-height:640px)]:block"
        style={{ height: `calc(100svh + ${N * 70}svh)` }}
      >
        <div className="sticky top-0 flex h-[100svh] items-center pb-6 pt-20">
          <div className="container-x">
            <div className="relative flex h-[calc(100svh-7rem)] max-h-[860px] min-h-[480px] flex-col overflow-hidden rounded-[2rem] bg-bg-2 ring-1 ring-black/5">
              {/* Progress */}
              <div className="absolute inset-x-0 top-0 z-20 h-0.5 bg-black/5">
                <motion.div className="h-0.5 origin-left" style={{ scaleX: barScale, background: YELLOW }} />
              </div>

              {/* Content: left column uses the full card height; the name sits under the devices */}
              <div className="relative z-10 grid min-h-0 flex-1 grid-cols-12 gap-8 px-8 pb-6 pt-8 lg:px-10">
                <div className="col-span-5 flex min-h-0 flex-col">
                  <Header size="text-[clamp(1.6rem,min(3vw,5.4svh),3rem)]" tight />
                  <div className="mt-[clamp(1rem,2.6svh,1.75rem)] space-y-2">
                    {SERVICES.map((s, i) => (
                      <Pill
                        key={s.slug}
                        s={s}
                        index={i}
                        idPrefix="pinned"
                        open={active === i}
                        onSelect={() => goTo(i)}
                      />
                    ))}
                  </div>
                </div>

                <div className="col-span-7 flex min-h-0 flex-col">
                  <div className="relative min-h-0 flex-1">
                    <AnimatePresence mode="wait">
                      <Stage key={current.slug} s={current} index={active} />
                    </AnimatePresence>
                  </div>

                  {/* The name: its own space, nothing overlaps it */}
                  <div className="relative mt-4 shrink-0">
                    <div className="overflow-hidden" aria-hidden="true">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={current.slug}
                          initial={{ y: "105%" }}
                          animate={{ y: 0 }}
                          exit={{ y: "-105%" }}
                          transition={{ duration: 0.55, ease: EASE }}
                          className="block whitespace-nowrap pb-[0.06em] font-display font-medium leading-[0.9] tracking-[-0.05em]"
                          style={{ color: INK, fontSize: "clamp(3rem,min(13svh,6.2vw),9rem)" }}
                        >
                          <span className="inline-block rounded-full px-[0.3em] pb-[0.04em]" style={{ background: YELLOW }}>
                            {current.title.split(" ")[0]}
                          </span>
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <p className="micro absolute bottom-2 right-0 hidden xl:block">Scroll or tap a service</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}