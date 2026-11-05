import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import MediaPlaceholder from "@/components/ui/MediaPlaceholder";
import { SERVICES } from "@/lib/content";

export default function Services() {
  return (
    <section className="bg-bg py-28 md:py-44">
      <div className="container-x">
        <Reveal>
          <SectionLabel>03 / Our capabilities</SectionLabel>
          <h2 className="h-display mt-8 text-[clamp(2.25rem,5.5vw,5rem)]">From concept<br />to final frame.</h2>
        </Reveal>

        <div className="mt-24 space-y-28 md:space-y-40">
          {SERVICES.map((s, i) => (
            <article key={s.slug} className="grid items-center gap-10 border-t border-line pt-10 md:grid-cols-12 md:gap-12">
              <Reveal className={`md:col-span-7 ${i % 2 ? "md:order-2" : ""}`}>
                <MediaPlaceholder label={s.title} className="aspect-[16/10] w-full" />
              </Reveal>
              <Reveal delay={0.1} className={`md:col-span-5 ${i % 2 ? "md:order-1" : ""}`}>
                <p className="micro">{s.n}</p>
                <h3 className="h-display mt-5 text-[clamp(1.75rem,3.2vw,2.75rem)]">{s.title}</h3>
                <p className="mt-6 max-w-md text-base leading-relaxed text-fg-2">{s.description}</p>
                <ul className="mt-8 divide-y divide-line border-y border-line text-sm text-fg-2">
                  {s.deliverables.map((d) => (<li key={d} className="py-3">{d}</li>))}
                </ul>
                <Link href={`/services/${s.slug}`} className="micro !text-white mt-8 inline-block border-b border-white/40 pb-2 transition-colors hover:border-white">
                  Explore service ↗
                </Link>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
