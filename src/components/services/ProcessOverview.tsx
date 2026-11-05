import Reveal from "@/components/ui/Reveal";
import { PROCESS } from "@/lib/content";

export default function ProcessOverview() {
  return (
    <section className="border-t border-line bg-bg-2 py-24 md:py-32" aria-label="Process overview">
      <div className="container-x">
        <Reveal>
          <p className="micro">Process</p>
          <h2 className="h-display mt-6 text-[clamp(1.75rem,3.6vw,3.25rem)]">A clear process.<br />A better creative outcome.</h2>
        </Reveal>
        <ol className="mt-14 grid border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {PROCESS.map((p) => (
            <li key={p.n} className="border-b border-line py-8 pr-8">
              <p className="micro">{p.n}</p>
              <p className="h-display mt-4 text-xl">{p.t}</p>
              <p className="mt-3 text-sm leading-relaxed text-fg-2">{p.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
