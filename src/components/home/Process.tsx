"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { PROCESS } from "@/lib/content";

export default function Process() {
  const [active, setActive] = useState(0);
  const current = PROCESS[active];

  return (
    <section className="bg-bg-2 py-28 md:py-44">
      <div className="container-x lg:grid lg:grid-cols-12 lg:gap-20">
        {/* Left: pinned heading + live step numeral */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <SectionLabel>06 / How we work</SectionLabel>
              <h2 className="h-display mt-8 text-[clamp(2.25rem,5.5vw,5rem)]">
                A clear process.
                <br />
                A better creative outcome.
              </h2>
            </Reveal>

            {/* Desktop-only oversized numeral */}
            <div className="relative mt-16 hidden h-[clamp(8rem,16vw,15rem)] overflow-hidden lg:block">
              <AnimatePresence mode="wait">
                <motion.span
                  key={current.n}
                  initial={{ y: "60%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-60%", opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="h-display absolute inset-0 block select-none text-[clamp(8rem,16vw,15rem)] leading-none text-transparent"
                  style={{ WebkitTextStroke: "1px rgba(255,255,255,0.35)" }}
                  aria-hidden="true"
                >
                  {current.n}
                </motion.span>
              </AnimatePresence>
            </div>

            <p className="micro mt-6 hidden lg:block">
              {current.n} <span className="text-fg-2">/ {String(PROCESS.length).padStart(2, "0")}</span>
            </p>
          </div>
        </div>

        {/* Right: ruled step list */}
        <ol className="mt-20 lg:col-span-7 lg:mt-0">
          {PROCESS.map((p, i) => {
            const isActive = i === active;
            return (
              <motion.li
                key={p.n}
                onViewportEnter={() => setActive(i)}
                viewport={{ margin: "-45% 0px -45% 0px" }}
                className="group relative border-t border-line py-10 md:py-14"
              >
                {/* square marker, same motif as the original */}
                <span
                  aria-hidden="true"
                  className={`absolute -top-[4.5px] left-0 h-2 w-2 transition-colors duration-500 ${
                    isActive ? "bg-white" : "bg-line"
                  }`}
                />

                <div
                  className={`grid gap-4 transition-opacity duration-500 md:grid-cols-[5rem_1fr] md:gap-8 ${
                    isActive ? "opacity-100" : "opacity-40 group-hover:opacity-80"
                  }`}
                >
                  <p className="micro pt-2">{p.n}</p>

                  <div>
                    <h3 className="h-display text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.05]">
                      {p.t}
                    </h3>
                    <p className="mt-5 max-w-md text-sm leading-relaxed text-fg-2 md:text-base">
                      {p.d}
                    </p>
                  </div>
                </div>
              </motion.li>
            );
          })}
          <li aria-hidden="true" className="border-t border-line" />
        </ol>
      </div>
    </section>
  );
}