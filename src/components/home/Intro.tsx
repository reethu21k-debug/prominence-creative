import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import MediaPlaceholder from "@/components/ui/MediaPlaceholder";

export default function Intro() {
  return (
    <section className="bg-bg py-28 md:py-44">
      <div className="container-x grid gap-16 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-6 md:pr-10">
          <Reveal>
            <SectionLabel>01 / Who we are</SectionLabel>
            <h2 className="h-display mt-8 text-[clamp(2rem,4.6vw,4.25rem)]">
              Good content gets attention.
              <span className="mt-2 block font-serif font-light normal-case italic tracking-[-0.02em] text-fg-2">Great content builds brands.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="mt-12 max-w-lg space-y-6 text-base leading-relaxed text-fg-2">
            <p>Prominence Creative is a creative production studio helping businesses, founders and creators transform ideas into impactful visual content.</p>
            <p>We bring together creative thinking, professional production and thoughtful editing to create content that connects with audiences and strengthens brands.</p>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="md:col-span-6">
          <MediaPlaceholder label="Production photograph or video" className="aspect-[4/5] w-full" />
        </Reveal>
      </div>
    </section>
  );
}
