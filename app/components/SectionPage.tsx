import type { SectionDefinition, SectionPanel } from "../sections/types";
import SectionShell from "./SectionShell";

export default function SectionPage({
  section,
  panels,
}: {
  section: SectionDefinition;
  panels: SectionPanel[];
}) {
  return (
    <SectionShell section={section}>
      <section className="grid gap-5 xl:grid-cols-2">
        {panels.map((panel) => (
          <article key={panel.title} className="panel rounded-[18px] p-4">
            <div>
              <p className="text-base font-medium text-zinc-100">{panel.title}</p>
              <p className="mt-1 text-sm text-zinc-400">{panel.description}</p>
            </div>

            <div className="mt-5 space-y-3">
              {panel.rows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between rounded-xl border border-white/8 bg-[#161616] px-3 py-3 text-sm"
                >
                  <span className="text-zinc-400">{row.label}</span>
                  <span className="font-mono text-zinc-100">{row.value}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </SectionShell>
  );
}
