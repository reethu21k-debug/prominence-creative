import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import MediaPlaceholder from "@/components/ui/MediaPlaceholder";
import { SERVICES, STAGES } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "Prominence Creative is a creative production studio helping businesses, founders and creators turn ideas into impactful visual content.",
  openGraph: { title: "About | Prominence Creative", url: "/about" },
  alternates: { canonical: "/about" },
};

const WORKS_WITH = [
  "Business owners and founders",
  "Established companies and startups",
  "E-commerce brands",
  "Educational institutions",
  "Personal brands and creators",
  "Real estate and hospitality brands",
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-bg pb-24 pt-40 md:pt-52">
        <div className="container-x">
          <Reveal>
            <p className="micro">About</p>
            <h1 className="h-display mt-8 max-w-6xl text-[clamp(2.5rem,7.5vw,7rem)]">
              We believe every brand has a story worth telling.
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="bg-bg pb-28">
        <div className="container-x grid gap-16 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <p className="micro">About Prominence Creative</p>
          </Reveal>
          <Reveal delay={0.1} className="space-y-6 text-lg leading-relaxed text-fg-2 md:col-span-6 md:col-start-7">
            <p>Prominence Creative is a creative production studio helping businesses, founders and creators transform ideas into impactful visual content.</p>
            <p>We bring together creative thinking, professional production and thoughtful editing to create content that connects with audiences and strengthens brands.</p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-bg-2 py-28">
        <div className="container-x grid gap-16 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <p className="micro">Our philosophy</p>
            <h2 className="font-serif mt-6 text-[clamp(2rem,4vw,3.5rem)] font-light italic leading-tight">Good content gets attention. Great content builds brands.</h2>
          </Reveal>
          <Reveal delay={0.1} className="space-y-6 text-base leading-relaxed text-fg-2 md:col-span-6 md:col-start-7">
            <p>Content works when it is made with intent. We start with what a brand needs to say and who it needs to reach, then let that decide the format, the framing and the edit.</p>
            <p>Quality sits in the details: lighting, sound, pacing, colour and the final export. We review work with clients before delivery and build their feedback into the final cut.</p>
            <p>Creating content should not feel like a full-time job. We aim to be one creative partner for the whole process, so you are not coordinating several suppliers.</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-bg py-28">
        <div className="container-x grid gap-16 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <p className="micro">Creative capabilities</p>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7">
            <ul className="divide-y divide-line border-y border-line">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="group flex items-center justify-between py-5 text-lg transition-colors hover:text-fg-2">
                    {s.title}<span className="micro transition-transform duration-300 group-hover:translate-x-1">↗</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="micro mt-12">We work with</p>
            <ul className="mt-4 space-y-2 text-sm text-fg-2">
              {WORKS_WITH.map((w) => (<li key={w}>{w}</li>))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-bg-3 py-28">
        <div className="container-x">
          <Reveal>
            <p className="micro">Production approach</p>
            <h2 className="h-display mt-6 text-[clamp(1.75rem,3.6vw,3.25rem)]">Plan. Shoot. Edit. Deliver.</h2>
          </Reveal>
          <ol className="mt-14 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
            {STAGES.map((s) => (
              <li key={s.n} className="border-b border-line py-8 pr-8 lg:border-b-0">
                <p className="micro">{s.n}</p>
                <p className="h-display mt-5 text-2xl">{s.t}</p>
                <p className="mt-3 text-sm leading-relaxed text-fg-2">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Team section intentionally omitted until real team details are supplied. */}

      <section className="bg-bg py-28" aria-label="Behind the scenes">
        <div className="container-x">
          <p className="micro mb-10">Behind the scenes</p>
          <div className="grid gap-4 md:grid-cols-12">
            <MediaPlaceholder label="Behind-the-scenes photograph" className="aspect-[16/10] md:col-span-7" />
            <MediaPlaceholder label="Behind-the-scenes photograph" className="aspect-[4/5] md:col-span-5" />
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-bg-2 py-28 md:py-40">
        <div className="container-x flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <h2 className="h-display text-[clamp(2.25rem,6vw,5.5rem)]">Let&apos;s talk about<br />your next project.</h2>
          <Button href="/contact">Start a project ↗</Button>
        </div>
      </section>
    </>
  );
}
