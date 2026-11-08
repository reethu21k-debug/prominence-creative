"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV, PHONES } from "@/lib/content";

const YELLOW = "#ffd23f";
const ACCENT = "#ff5a1f";
const INK = "#0a0a0a";
const EASE = [0.22, 1, 0.36, 1] as const;

export default function Navbar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const lastY = useRef(0);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  // Scrolled state + hide on scroll down / show on scroll up.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(!open && y > lastY.current && y > 240);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Close the mobile menu if the viewport grows to desktop width.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => { if (mq.matches) setOpen(false); };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const spring = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 380, damping: 32 };

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-130%" : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE }}
        onFocusCapture={() => setHidden(false)}
        className="fixed inset-x-0 top-0 z-50 pt-3 md:pt-4"
      >
        <div className="container-x">
          <div
            className={`flex h-14 items-center justify-between rounded-full pl-5 pr-2 ring-1 transition-[background-color,box-shadow] duration-500 md:h-16 md:pl-7 ${
              scrolled || open
                ? "bg-white shadow-[0_10px_30px_-14px_rgba(0,0,0,0.18)] ring-black/5"
                : "bg-transparent shadow-none ring-transparent"
            }`}
          >
            <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: ACCENT }} />
              <span className="font-display text-sm font-medium uppercase tracking-[0.18em]">Prominence Creative</span>
            </Link>

            {/* Desktop */}
            <nav aria-label="Primary" className="hidden items-center md:flex" onMouseLeave={() => setHover(null)}>
              <ul className="flex items-center gap-1">
                {NAV.map((l) => {
                  const active = isActive(l.href);
                  return (
                    <li key={l.href} className="relative">
                      <Link
                        href={l.href}
                        aria-current={active ? "page" : undefined}
                        onMouseEnter={() => setHover(l.href)}
                        onFocus={() => setHover(l.href)}
                        onBlur={() => setHover(null)}
                        className={`relative block rounded-full px-4 py-2.5 text-[0.6875rem] uppercase tracking-[0.2em] transition-colors duration-300 ${
                          active ? "text-[#0a0a0a]" : "text-fg-2 hover:text-fg"
                        }`}
                      >
                        {hover === l.href && !active && (
                          <motion.span layoutId="nav-hover" transition={spring} className="absolute inset-0 -z-10 rounded-full bg-black/5" />
                        )}
                        {active && (
                          <motion.span layoutId="nav-active" transition={spring} className="absolute inset-0 -z-10 rounded-full" style={{ background: YELLOW }} />
                        )}
                        {l.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <Link
                href="/contact"
                className="group ml-3 flex items-center gap-4 rounded-full py-1.5 pl-5 pr-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-black"
                style={{ background: INK }}
              >
                Start a project
                <span
                  aria-hidden="true"
                  className="grid h-9 w-9 place-items-center rounded-full text-base transition-transform duration-500 group-hover:rotate-45"
                  style={{ background: YELLOW, color: INK }}
                >
                  ↗
                </span>
              </Link>
            </nav>

            {/* Mobile toggle */}
            <button
              className="grid h-11 w-11 place-items-center rounded-full bg-bg-2 md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu: sibling of the header so the header's transform can't affect `fixed` */}
      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-bg md:hidden"
          >
            <div className="container-x flex min-h-full flex-col justify-between pb-8 pt-28">
              <ul>
                {NAV.map((l, i) => {
                  const active = isActive(l.href);
                  return (
                    <motion.li
                      key={l.href}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: reduce ? 0 : 0.05 * i + 0.1, duration: reduce ? 0 : 0.5, ease: EASE }}
                      className="border-b border-line"
                    >
                      <Link
                        href={l.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className="flex items-center justify-between gap-4 py-5"
                      >
                        <span className="flex items-baseline gap-4">
                          <span className="micro">{String(i + 1).padStart(2, "0")}</span>
                          <span
                            className="h-display rounded-full text-[clamp(2.25rem,11vw,3.5rem)] leading-none"
                            style={active ? { background: YELLOW, padding: "0.05em 0.35em 0.1em" } : undefined}
                          >
                            {l.label}
                          </span>
                        </span>
                        <span aria-hidden="true" className="text-xl text-fg-2">↗</span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <div className="mt-10 space-y-6">
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-full py-2 pl-7 pr-2 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-white"
                  style={{ background: INK }}
                >
                  Start a project
                  <span aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-full text-lg" style={{ background: YELLOW, color: INK }}>↗</span>
                </Link>
                <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-fg-2">
                  {PHONES.map((p) => (
                    <li key={p}>
                      <a className="inline-block py-1.5" href={`tel:${p.replace(/\s/g, "")}`}>{p}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}