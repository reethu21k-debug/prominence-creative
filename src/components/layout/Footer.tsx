import Link from "next/link";
import { NAV, PHONES } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-bg">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-display text-sm font-medium uppercase tracking-[0.18em]">Prominence Creative</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-fg-2">We create premium visual content that makes brands stand out.</p>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <p className="micro mb-4">Navigate</p>
          <ul className="space-y-2 text-sm text-fg-2">
            {NAV.map((l) => (<li key={l.href}><Link className="inline-block py-1.5 transition-colors hover:text-white" href={l.href}>{l.label}</Link></li>))}
          </ul>
        </nav>
        <div className="md:col-span-4">
          <p className="micro mb-4">Contact</p>
          <ul className="space-y-2 text-sm text-fg-2">
            {PHONES.map((p) => (<li key={p}><a className="inline-block py-1.5 transition-colors hover:text-white" href={`tel:${p.replace(/\s/g, "")}`}>{p}</a></li>))}
          </ul>
        </div>
      </div>
      <div className="container-x border-t border-line py-6">
        <p className="micro">© {new Date().getFullYear()} Prominence Creative</p>
      </div>
    </footer>
  );
}
