"use client";

import Image from "next/image";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { GlowOrbBg } from "@/components/ui/glow-orb-bg";
import { FOUNDERS } from "@/lib/data/founders";

export function AboutUs() {
  return (
    <section id="about" className="relative isolate px-4 py-28 sm:px-8">
      <GlowOrbBg />

      <div className="mx-auto flex max-w-3xl flex-col items-center gap-16 text-center">
        <SectionHeading
          eyebrow="Who You're Hiring"
          title="Two founders, not a faceless agency."
          description="Rise Web is run by Trevyn and Walter — no account managers, no outsourcing, just the two of us on every project."
          align="center"
        />

        <div className="flex flex-col items-center gap-12 sm:flex-row sm:items-start sm:justify-center sm:gap-20">
          {FOUNDERS.map((founder, index) => (
            <Reveal key={founder.name} delay={index * 0.12}>
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative h-36 w-36 overflow-hidden rounded-full border border-white/10 shadow-[0_0_60px_-15px_rgba(47,93,255,0.5)] sm:h-44 sm:w-44">
                  <Image
                    src={founder.photo}
                    alt={founder.name}
                    fill
                    sizes="176px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">{founder.name}</h3>
                  <p className="label-mono mt-1 text-xs text-highlight">{founder.title}</p>
                </div>
                <p className="max-w-xs text-sm leading-relaxed text-muted">{founder.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
