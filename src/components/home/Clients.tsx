import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import ClientsAccordion from "@/components/ui/ClientsAccordion";

const items = [
  { name: "EDGEX Learning", image: "/edgex.png" },
  { name: "Ira Holidays", image: "/ira-holidays.png" },
  { name: "Modern Indian Interior Designers", image: "/indian-interior-designers.png" },
  { name: "Star Agile", image: "/star-agile.png" },
];

export default function Clients() {
  return (
    <section className="bg-bg py-20 md:py-32">
      <div className="container-x">
        <Reveal>
          <SectionLabel>05 / Trusted by</SectionLabel>
          <h2 className="h-display mt-6 text-balance text-[clamp(1.875rem,5.2vw,3.25rem)] md:mt-8">
            Built through creative collaboration.
          </h2>
        </Reveal>

        <div className="mt-10 md:mt-16">
          <ClientsAccordion items={items} defaultIndex={0} accentColor="#ffd23f" overlayColor="#0a0a0a" />
          <p className="micro mt-5 text-right sm:hidden">Tap a client to open</p>
          <p className="micro mt-5 hidden text-right sm:block">Hover a client to open</p>
        </div>
      </div>
    </section>
  );
}