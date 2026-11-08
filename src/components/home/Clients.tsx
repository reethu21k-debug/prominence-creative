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
    <section className="bg-bg py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <SectionLabel>05 / Trusted by</SectionLabel>
          <h2 className="h-display mt-8 text-[clamp(1.75rem,3.6vw,3.25rem)]">Built through creative collaboration.</h2>
        </Reveal>
        <div className="mt-16">
          <ClientsAccordion items={items} defaultIndex={0} />
        </div>
      </div>
    </section>
  );
}