"use client";

import {
  Activity,
  Cpu,
  HardDriveDownload,
} from "lucide-react";
import MetricCard from "./components/MetricCard";

const recentActivity = [
  {
    title: "Nuevo upload en compartidos",
    detail: "backup-abril.zip se movio a /data/nexo/compartidos",
    time: "Hace 8 min",
  },
  {
    title: "Tunnel publico activo",
    detail: "Cloudflare renovado sin abrir puertos del router",
    time: "Hace 19 min",
  },
  {
    title: "VM ubuntu-dev reiniciada",
    detail: "Accion manual desde token con permisos acotados",
    time: "Hace 43 min",
  },
];

const storagePools = [
  { label: "Sistema", value: "34 / 60 GB", width: "57%" },
  { label: "Documentos", value: "92 / 180 GB", width: "51%" },
  { label: "Backups", value: "144 / 220 GB", width: "65%" },
  { label: "Compartidos", value: "18 / 40 GB", width: "45%" },
];

export default function Home() {
  return (
    <div className="space-y-6">
      <section className="panel rounded-[18px] p-4">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">
              Resumen
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-100">
              Estado general del servidor
            </h2>
          </div>

          <div className="grid gap-2 sm:min-w-[280px]">
            <div className="flex items-center justify-between rounded-xl border border-white/8 bg-[#161616] px-3 py-2.5 text-sm">
              <span className="text-zinc-400">Uptime</span>
              <span className="font-mono text-zinc-100">16d 08h 14m</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/8 bg-[#161616] px-3 py-2.5 text-sm">
              <span className="text-zinc-400">Tunnel publico</span>
              <span className="font-mono text-zinc-100">Activo</span>
            </div>
            
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="CPU host"
          value="27%"
          change="+4% hoy"
          icon={Cpu}
          trend={[52, 58, 76, 34, 61, 18, 18, 41, 49, 23, 54, 42, 9, 22]}
        />
        <MetricCard
          title="Memoria"
          value="8.6 / 16 GB"
          change="+0.8 GB"
          icon={Activity}
          trend={[44, 46, 47, 49, 51, 52, 54, 55, 54, 56, 57, 56, 54, 54]}
        />
        <MetricCard
          title="Almacenamiento"
          value="268 GB"
          change="57% libre"
          icon={HardDriveDownload}
        />
      </section>

      

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="grid gap-5">
          <article className="panel rounded-[18px] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-zinc-100">
                  Distribucion del almacenamiento
                </p>
              </div>
              <span className="rounded-full border border-white/8 bg-[#161616] px-3 py-1 text-xs text-zinc-300">
                470 GB fisicos
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {storagePools.map((pool) => (
                <div key={pool.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-300">{pool.label}</span>
                    <span className="font-mono text-zinc-400">{pool.value}</span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#141414]">
                    <div
                      className="h-full rounded-full bg-[#717171]"
                      style={{ width: pool.width }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="grid gap-5">
          
          <article className="panel rounded-[18px] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-zinc-100">
                  Actividad reciente
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {recentActivity.map((event) => (
                <div key={event.title} className="flex gap-4">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-zinc-500" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-zinc-100">
                        {event.title}
                      </p>
                      <span className="text-xs text-zinc-500">{event.time}</span>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">
                      {event.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
