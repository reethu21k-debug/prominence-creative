import Link from "next/link";
import { NAV, PHONES } from "@/lib/content";

const YELLOW = "#ffd23f";
const ACCENT = "#ff5a1f";
const INK = "#0a0a0a";

const LABEL = "mb-5 text-[0.6875rem] uppercase tracking-[0.2em] text-white/45";

export default function Footer() {
  return (
    <footer className="bg-bg px-3 pb-3 md:px-4 md:pb-4">
      <div className="relative overflow-hidden rounded-[2rem] text-white" style={{ background: INK }}>
        {/* Top: brand | navigate | contact */}
        <div className="container-x grid gap-14 pb-14 pt-14 md:grid-cols-12 md:pt-20">
          <div className="md:col-span-5">
            <p className="flex items-center gap-2.5 font-display text-sm font-medium uppercase tracking-[0.18em]">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: ACCENT }} />
              Prominence Creative
            </p>
            <p className="mt-8 max-w-md font-display text-[clamp(1.5rem,2.4vw,2.25rem)] font-medium leading-[1.15] tracking-[-0.03em]">
              We create premium visual content that makes brands{" "}
              <span className="inline-block rounded-full px-[0.4em] pb-[0.06em]" style={{ background: YELLOW, color: INK }}>
                stand out.
              </span>
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <p className={LABEL}>Navigate</p>
            <ul>
              {NAV.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="group relative inline-block py-1.5 text-base text-white/60 transition-colors duration-300 hover:text-white">
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 scale-0 rounded-full transition-transform duration-300 group-hover:scale-100"
                      style={{ background: YELLOW }}
                    />
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-4">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <p className={LABEL}>Contact</p>
            <ul>
              {PHONES.map((p) => (
                <li key={p}>
                  <a
                    className="inline-block py-1.5 font-display text-xl tracking-[-0.02em] text-white/60 transition-colors duration-300 hover:text-white md:text-2xl"
                    href={`tel:${p.replace(/\s/g, "")}`}
                  >
                    {p}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="container-x flex items-center justify-between gap-4 py-5">
            <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-white/45">
              © {new Date().getFullYear()} Prominence Creative
            </p>
            <a
              href="#"
              className="group inline-flex items-center gap-3 rounded-full bg-white/10 py-1.5 pl-4 pr-1.5 text-[0.6875rem] uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-white/15"
            >
              Back to top
              <span
                aria-hidden="true"
                className="grid h-8 w-8 place-items-center rounded-full text-base transition-transform duration-300 group-hover:-translate-y-0.5"
                style={{ background: YELLOW, color: INK }}
              >
                ↑
              </span>
            </a>
          </div>
        </div>

        {/* Oversized wordmark, cropped by the card edge */}
        <div aria-hidden="true" className="container-x select-none pt-6">
          <div className="flex translate-y-[12%] items-end gap-[0.18em] whitespace-nowrap font-display text-[clamp(3rem,11.5vw,11rem)] font-medium leading-[0.8] tracking-[-0.06em]">
            <span>Prominence</span>
            <span
              className="mb-[0.16em] rounded-full px-[0.5em] pb-[0.05em] text-[0.26em] leading-[1.6] tracking-[-0.03em]"
              style={{ background: YELLOW, color: INK }}
            >
              Creative
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}