"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV } from "@/lib/content";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Close the mobile menu if the viewport grows to desktop width (e.g. rotating a tablet).
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

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${scrolled || open ? "bg-bg/95 border-b border-line" : "bg-transparent border-b border-transparent"}`}>
      <div className="container-x flex h-20 items-center justify-between">
        <Link href="/" className="font-display text-sm font-medium uppercase tracking-[0.18em]" onClick={() => setOpen(false)}>
          Prominence Creative
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-10 md:flex">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} className="micro !text-fg-2 transition-colors hover:!text-white">{l.label}</Link>
          ))}
          <Link href="/contact" className="border border-white/40 px-5 py-3 text-[0.6875rem] uppercase tracking-[0.2em] transition-colors hover:bg-white hover:text-bg">
            Start a project ↗
          </Link>
        </nav>

        <button className="-mr-3 p-3 md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-20 bottom-0 flex flex-col justify-between bg-bg px-6 pb-10 pt-8 md:hidden"
          >
            <ul>
              {NAV.map((l, i) => (
                <motion.li key={l.href} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i + 0.1 }} className="border-b border-line">
                  <Link href={l.href} onClick={() => setOpen(false)} className="h-display block py-6 text-4xl">{l.label}</Link>
                </motion.li>
              ))}
            </ul>
            <Link href="/contact" onClick={() => setOpen(false)} className="bg-white py-5 text-center text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-bg">
              Start a project ↗
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
