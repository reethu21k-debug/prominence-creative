'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export type AccordionItem = { name: string; image: string; alt?: string };

type Props = {
  items: AccordionItem[];
  defaultIndex?: number;
  /** Share of the row taken by the open panel (horizontal layout). */
  expandRatio?: number;
  /** Same, for the stacked mobile layout. Higher = collapsed strips stay at their minimum height. */
  verticalExpandRatio?: number;
  height?: number;
  gap?: number;
  radius?: number;
  duration?: number;
  parallax?: number;
  tilt?: number;
  stagger?: number;
  grayscale?: boolean;
  background?: string;
  overlayColor?: string;
  accentColor?: string;
  textColor?: string;
};

// Stacked layout applies below Tailwind's `sm` breakpoint (640px). Keep these two in sync.
const VERTICAL_QUERY = '(max-width: 639.98px)';
// Height of a collapsed strip in the stacked layout. Keep in sync with `max-sm:min-h-[84px]` below.
const COLLAPSED_V = 84;

export default function ClientsAccordion({
  items,
  defaultIndex = 0,
  expandRatio = 0.52,
  verticalExpandRatio = 0.7,
  height = 460,
  gap = 10,
  radius = 16,
  duration = 0.6,
  parallax = 0.5,
  tilt = 8,
  stagger = 0.06,
  grayscale = true,
  background = '#000000',
  overlayColor = '#060010',
  accentColor = '#ffffff',
  textColor = '#ffffff',
}: Props) {
  const rootRef = useRef<HTMLUListElement>(null);
  const panelRefs = useRef<(HTMLLIElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const firstRun = useRef(true);
  const mediaSize = useRef(320);

  const count = items.length;
  const [active, setActive] = useState(Math.min(Math.max(defaultIndex, 0), count - 1));

  const overlayBg = `linear-gradient(180deg, transparent 45%, color-mix(in srgb, ${overlayColor} 78%, transparent) 100%), color-mix(in srgb, ${overlayColor} calc(var(--ag-dim, 0.35) * 100%), transparent)`;

  const applyLayout = useCallback(
    (animate: boolean) => {
      const panels = panelRefs.current;
      if (!panels.length) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const vertical = window.matchMedia(VERTICAL_QUERY).matches;
      const ratio = vertical ? verticalExpandRatio : expandRatio;
      const r = Math.min(Math.max(ratio, 0.2), 0.9);
      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
      const dur = animate && !reduced ? duration : 0;

      tlRef.current?.kill();
      const tl = gsap.timeline();

      panels.forEach((panel, i) => {
        if (!panel) return;
        const on = i === active;
        const media = mediaRefs.current[i];
        const bar = barRefs.current[i];
        const text = textRefs.current[i];

        const rot = on ? 0 : i < active ? tilt : -tilt;
        tl.to(
          panel,
          { flexGrow: on ? grow : 1, rotateY: vertical ? 0 : rot, duration: dur, ease: 'power3.out' },
          0
        );

        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, active - i));
          const shift = drift * parallax * mediaSize.current * 0.06;
          tl.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: vertical ? 0 : on ? 0 : shift,
              y: vertical ? (on ? 0 : shift) : 0,
              '--ag-gray': grayscale ? (on ? 0 : 1) : 0,
              '--ag-dim': on ? 0 : 0.35,
              duration: dur,
              ease: 'power3.out',
            },
            0
          );
        }

        if (bar && text) {
          if (on) {
            tl.to([bar, text], { opacity: 1, x: 0, duration: dur, ease: 'power3.out', stagger: reduced ? 0 : stagger }, 0);
          } else if (vertical) {
            // Touch has no hover, so keep every name readable on the collapsed strips.
            tl.to(bar, { opacity: 0.35, x: 0, duration: dur, ease: 'power3.out' }, 0);
            tl.to(text, { opacity: 0.9, x: 0, duration: dur, ease: 'power3.out' }, 0);
          } else {
            tl.to([bar, text], { opacity: 0, x: -14, duration: dur * 0.6, ease: 'power3.out' }, 0);
          }
        }
      });

      tlRef.current = tl;
    },
    [active, count, expandRatio, verticalExpandRatio, duration, tilt, parallax, grayscale, stagger]
  );

  // Measure the container so the images are sized to the expanded panel
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const vertical = window.matchMedia(VERTICAL_QUERY).matches;
      const rect = el.getBoundingClientRect();
      let size: number;
      if (vertical) {
        // Open panel height = list height minus the collapsed strips and gaps.
        size = Math.max(140, rect.height - (count - 1) * (COLLAPSED_V + gap));
      } else {
        const usable = Math.max(rect.width - gap * (count - 1), 120);
        size = Math.max(140, usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22);
      }
      mediaSize.current = size;
      el.style.setProperty('--ag-media-size', `${size}px`);
      applyLayout(!firstRun.current);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [applyLayout, gap, count, expandRatio]);

  useEffect(() => {
    applyLayout(!firstRun.current);
    firstRun.current = false;
  }, [applyLayout]);

  useEffect(() => () => { tlRef.current?.kill(); }, []);

  const onKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i + 1) % count);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i - 1 + count) % count);
    }
  };

  return (
    <ul
      ref={rootRef}
      aria-label="Our clients"
      // Mobile: a definite height (--ag-vheight) is what lets flex-grow actually expand the open panel.
      className="flex w-full flex-row [perspective:1400px] max-sm:!h-[var(--ag-vheight)] max-sm:flex-col max-sm:[perspective:none]"
      style={
        {
          gap,
          height: `min(${height}px, 72svh)`,
          ['--ag-vheight' as string]: `calc(${count - 1} * (${COLLAPSED_V}px + ${gap}px) + clamp(210px, 38svh, 320px))`,
        } as React.CSSProperties
      }
    >
      {items.map((item, i) => (
        <li
          key={item.name}
          ref={(el) => { panelRefs.current[i] = el; }}
          tabIndex={0}
          aria-current={i === active ? 'true' : undefined}
          aria-label={item.name}
          onMouseEnter={() => setActive(i)}
          onFocus={() => setActive(i)}
          onClick={() => setActive(i)}
          onKeyDown={(e) => onKeyDown(i, e)}
          className="relative min-h-0 min-w-0 flex-[1_1_0] cursor-pointer overflow-hidden outline-none [transform-origin:center] [transform-style:preserve-3d] [box-shadow:0_10px_30px_-18px_rgba(0,0,0,0.8)] focus-visible:ring-2 focus-visible:ring-white max-sm:min-h-[84px] max-sm:!transform-none"
          style={{ borderRadius: radius, background, willChange: 'flex-grow, transform' }}
        >
          <span className="absolute inset-0 overflow-hidden [border-radius:inherit]">
            <span
              ref={(el) => { mediaRefs.current[i] = el; }}
              className="absolute left-1/2 top-1/2 h-full w-[var(--ag-media-size,320px)] [filter:grayscale(var(--ag-gray,1))] max-sm:h-[var(--ag-media-size,320px)] max-sm:w-full"
              style={{ background, willChange: 'transform, filter' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.alt ?? item.name}
                draggable={false}
                className="block h-full w-full select-none object-contain"
              />
            </span>
            <span className="pointer-events-none absolute inset-0" style={{ background: overlayBg }} aria-hidden="true" />
          </span>

          <span className="pointer-events-none absolute inset-x-5 bottom-5 z-[2] flex items-center gap-3" aria-hidden="true">
            <span
              ref={(el) => { barRefs.current[i] = el; }}
              className="h-[26px] w-[3px] flex-none rounded-[3px] opacity-0"
              style={{
                background: accentColor,
                boxShadow: `0 0 12px color-mix(in srgb, ${accentColor} 60%, transparent)`,
              }}
            />
            <span
              ref={(el) => { textRefs.current[i] = el; }}
              className="truncate text-[clamp(1rem,1.4vw,1.4rem)] font-semibold tracking-[0.01em] opacity-0 [text-shadow:0_2px_14px_rgba(0,0,0,0.55)]"
              style={{ color: textColor }}
            >
              {item.name}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}