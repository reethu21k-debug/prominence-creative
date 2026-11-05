import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Intro from "@/components/home/Intro";
import SelectedWork from "@/components/home/SelectedWork";
import Services from "@/components/home/Services";
import Difference from "@/components/home/Difference";
import Clients from "@/components/home/Clients";
import Process from "@/components/home/Process";
import FinalCta from "@/components/home/FinalCta";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <SelectedWork />
      <Services />
      <Difference />
      <Clients />
      <Process />
      <FinalCta />
    </>
  );
}
