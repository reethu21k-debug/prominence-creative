import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { PROBLEMS, STAGES } from "@/lib/content";

export default function Difference() {
  return (
    <section className="bg-bg-3 py-28 md:py-44">
      <div className="container-x">
        <div className="grid gap-16 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <SectionLabel>04 / The difference</SectionLabel>
            <h2 className="h-display mt-8 text-[clamp(2rem,4.6vw,4.25rem)]">Creating content shouldn&apos;t feel like a full-time job.</h2>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-5 md:pt-10">
            <ul className="divide-y divide-line border-y border-line">
              {PROBLEMS.map((p) => (<li key={p} className="py-4 text-base text-fg-2">{p}</li>))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="mt-32">
          <h3 className="font-serif text-[clamp(2rem,4vw,3.5rem)] font-light italic leading-tight">
            One creative partner.<br />The complete production process.
          </h3>
        </Reveal>

        <ol className="mt-14 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {STAGES.map((s, i) => (
            <li key={s.n} className="border-b border-line py-8 pr-8 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0">
              <Reveal delay={i * 0.08}>
                <p className="micro">{s.n}</p>
                <p className="h-display mt-6 text-2xl">{s.t}</p>
                <p className="mt-3 text-sm leading-relaxed text-fg-2">{s.d}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
