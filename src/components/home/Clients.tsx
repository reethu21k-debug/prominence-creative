import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { CLIENTS } from "@/lib/content";

export default function Clients() {
  return (
    <section className="bg-bg py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <SectionLabel>05 / Trusted by</SectionLabel>
          <h2 className="h-display mt-8 text-[clamp(1.75rem,3.6vw,3.25rem)]">Built through creative collaboration.</h2>
        </Reveal>
        {/* Shown as text wordmarks until approved logos are supplied. */}
        <ul className="mt-16 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {CLIENTS.map((c) => (
            <li key={c} className="flex min-h-32 items-center border-b border-line py-8 pr-6 font-display text-lg tracking-tight text-fg-2 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0">
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
