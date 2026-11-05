import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import MediaPlaceholder from "@/components/ui/MediaPlaceholder";
import { SERVICE_LIST } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description: "Product shoots, Meta ad creatives, AI-powered video, social media editing and podcast production from concept to final frame.",
  openGraph: { title: "Services | Prominence Creative", url: "/services" },
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <section className="bg-bg pb-24 pt-40 md:pt-52">
        <div className="container-x">
          <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <h1 className="h-display text-[clamp(2.25rem,9vw,8rem)]">From concept<br />to final frame.</h1>
            <p className="max-w-xs text-base leading-relaxed text-fg-2">Five production services, delivered by one creative partner.</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-bg pb-32">
        <div className="container-x">
          {SERVICE_LIST.map((s) => (
            <article key={s.slug} className="border-t border-line py-16 md:py-24">
              <div className="grid gap-10 md:grid-cols-12">
                <div className="md:col-span-6">
                  <p className="micro">{s.n}</p>
                  <h2 className="h-display mt-6 text-[clamp(2rem,4.6vw,4.25rem)]">
                    <Link href={`/services/${s.slug}`} className="transition-colors hover:text-fg-2">{s.title}</Link>
                  </h2>
                </div>
                <div className="md:col-span-5 md:col-start-8">
                  <p className="text-base leading-relaxed text-fg-2">{s.description}</p>
                  <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-fg-2">
                    {s.deliverables.map((d) => (<li key={d}>{d}</li>))}
                  </ul>
                  <Link href={`/services/${s.slug}`} className="micro !text-white mt-8 inline-block border-b border-white/40 pb-2 transition-colors hover:border-white">
                    Explore service ↗
                  </Link>
                </div>
              </div>
              <Reveal className="mt-14">
                <MediaPlaceholder label={s.title} className="aspect-[21/9] w-full" />
              </Reveal>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-bg-2 py-28">
        <div className="container-x flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <h2 className="h-display text-[clamp(2rem,5vw,4.5rem)]">Not sure which<br />service fits?</h2>
          <Button href="/contact">Start a project ↗</Button>
        </div>
      </section>
    </>
  );
}
