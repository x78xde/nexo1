import type { ReactNode } from "react";
import type { SectionDefinition } from "../sections/types";

export default function SectionShell({
  section,
  children,
}: {
  section: SectionDefinition;
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <section className="panel rounded-[18px] p-4">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">
              {section.eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-100">
              {section.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              {section.description}
            </p>
          </div>

          <div className="grid gap-2">
            {section.summary.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl border border-white/8 bg-[#161616] px-3 py-2.5 text-sm"
              >
                <span className="text-zinc-400">{item.label}</span>
                <span className="font-mono text-zinc-100">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {children}
    </div>
  );
}
