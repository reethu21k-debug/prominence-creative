'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export type AccordionItem = { name: string; image: string; alt?: string };

type Props = {
  items: AccordionItem[];
  defaultIndex?: number;
  expandRatio?: number;
  height?: number;
  gap?: number;
  radius?: number;
  duration?: number;
  parallax?: number;
  tilt?: number;
  stagger?: number;
  grayscale?: boolean;
  overlayColor?: string;
  accentColor?: string;
  textColor?: string;
};

export default function ClientsAccordion({
  items,
  defaultIndex = 0,
  expandRatio = 0.52,
  height = 460,
  gap = 10,
  radius = 16,
  duration = 0.6,
  parallax = 0.5,
  tilt = 8,
  stagger = 0.06,
  grayscale = true,
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
      const vertical = window.matchMedia('(max-width: 520px)').matches;
      const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
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
          } else {
            tl.to([bar, text], { opacity: 0, x: -14, duration: dur * 0.6, ease: 'power3.out' }, 0);
          }
        }
      });

      tlRef.current = tl;
    },
    [active, count, expandRatio, duration, tilt, parallax, grayscale, stagger]
  );

  // Measure the container so the images are sized to the expanded panel
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const vertical = window.matchMedia('(max-width: 520px)').matches;
      const rect = el.getBoundingClientRect();
      const total = vertical ? rect.height : rect.width;
      const usable = Math.max(total - gap * (count - 1), 120);
      const size = Math.max(140, usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22);
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
      className="flex w-full flex-row [perspective:1400px] max-[520px]:!h-auto max-[520px]:flex-col max-[520px]:[perspective:none]"
      style={{ gap, height }}
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
          className="relative min-h-0 min-w-0 flex-[1_1_0] cursor-pointer overflow-hidden bg-black outline-none [transform-origin:center] [transform-style:preserve-3d] [box-shadow:0_10px_30px_-18px_rgba(0,0,0,0.8)] focus-visible:ring-2 focus-visible:ring-white max-[520px]:min-h-[84px] max-[520px]:!transform-none"
          style={{ borderRadius: radius, willChange: 'flex-grow, transform' }}
        >
          <span className="absolute inset-0 overflow-hidden [border-radius:inherit]">
            <span
              ref={(el) => { mediaRefs.current[i] = el; }}
              className="absolute left-1/2 top-1/2 h-full w-[var(--ag-media-size,320px)] bg-black [filter:grayscale(var(--ag-gray,1))] max-[520px]:h-[var(--ag-media-size,320px)] max-[520px]:w-full"
              style={{ willChange: 'transform, filter' }}
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