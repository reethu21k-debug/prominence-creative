import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import WhatsAppButtons from "@/components/contact/WhatsAppButtons";
import ContactForm from "./ContactForm";
import { PHONES, SERVICES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project with Prominence Creative. Tell us about your idea, campaign or brand and we will get back to you.",
  openGraph: { title: "Contact | Prominence Creative", url: "/contact" },
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
  const defaultService = SERVICES.find((s) => s.slug === service)?.title;

  return (
    <section className="bg-bg pb-32 pt-40 md:pt-52">
      <div className="container-x grid gap-20 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <p className="micro">Contact</p>
          <h1 className="h-display mt-8 text-[clamp(2.5rem,5.5vw,5rem)]">Let&apos;s talk about your next project.</h1>
          <div className="mt-14">
            <p className="micro">Phone</p>
            <ul className="mt-4 space-y-2 text-lg">
              {PHONES.map((p) => (
                <li key={p}><a href={`tel:${p.replace(/\s/g, "")}`} className="transition-colors hover:text-fg-2">{p}</a></li>
              ))}
            </ul>
            <div className="mt-10"><WhatsAppButtons /></div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="md:col-span-7">
          <ContactForm defaultService={defaultService} />
        </Reveal>
      </div>
    </section>
  );
}
