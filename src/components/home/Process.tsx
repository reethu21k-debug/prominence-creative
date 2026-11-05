import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { PROCESS } from "@/lib/content";

export default function Process() {
  return (
    <section className="bg-bg-2 py-28 md:py-44">
      <div className="container-x">
        <Reveal>
          <SectionLabel>06 / How we work</SectionLabel>
          <h2 className="h-display mt-8 text-[clamp(2.25rem,5.5vw,5rem)]">A clear process.<br />A better creative outcome.</h2>
        </Reveal>

        <ol className="mt-20 border-l border-line lg:grid lg:grid-cols-6 lg:border-l-0 lg:border-t">
          {PROCESS.map((p, i) => (
            <li key={p.n} className="relative pb-12 pl-8 lg:pb-0 lg:pl-0 lg:pr-6 lg:pt-8">
              <span className="absolute -left-[4.5px] top-1.5 h-2 w-2 bg-white lg:-top-[4.5px] lg:left-0" aria-hidden="true" />
              <Reveal delay={i * 0.06}>
                <p className="micro">{p.n}</p>
                <p className="h-display mt-4 text-xl">{p.t}</p>
                <p className="mt-3 text-sm leading-relaxed text-fg-2">{p.d}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
