"use client";

import Image from "next/image";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { FOUNDERS } from "@/lib/data/founders";

export function AboutUs() {
  return (
    <section id="about" className="relative isolate px-4 py-28 sm:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-[160px]" />
      </div>

      <div className="mx-auto flex max-w-5xl flex-col gap-16">
        <SectionHeading
          eyebrow="Who We Are"
          title="Two founders. One promise: a website that actually works for your business."
          description="Rise Web is run by Trevyn and Walter — no account managers, no outsourcing, just the two of us on every project."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {FOUNDERS.map((founder, index) => (
            <Reveal key={founder.name} delay={index * 0.1}>
              <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-surface/60 transition-colors duration-300 hover:border-primary/40">
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={founder.photo}
                    alt={founder.name}
                    fill
                    sizes="(min-width: 640px) 420px, 100vw"
                    className="object-cover grayscale-[15%] transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60" />
                </div>
                <div className="flex flex-col gap-3 p-8">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">{founder.name}</h3>
                    <p className="mt-1 text-sm font-medium text-highlight">{founder.title}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-muted">{founder.bio}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
