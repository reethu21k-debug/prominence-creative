import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";

export default function FinalCta() {
  return (
    <section className="bg-bg py-28 md:py-40">
      <div className="container-x">
        <Reveal>
          {/* Matches the Hero headline scale so the page opens and closes at the same size. */}
          <h2 className="h-display text-[clamp(2.5rem,11vw,4.25rem)] md:text-[clamp(4rem,8.5vw,8rem)]">
            Let&apos;s create<br />
            <span className="text-[1.1em] font-serif font-light normal-case italic tracking-[-0.02em]">something</span><br />
            remarkable.
          </h2>
        </Reveal>
        <Reveal delay={0.15} className="mt-12 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-base leading-relaxed text-fg-2 md:max-w-lg md:text-lg">
            Have an idea, campaign or brand that deserves better content? Let&apos;s bring it to life.
          </p>
          <Button href="/contact">Start a project ↗</Button>
        </Reveal>
      </div>
    </section>
  );
}