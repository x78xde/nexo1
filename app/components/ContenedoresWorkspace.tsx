"use client";

import { Boxes, Cpu, HardDrive, MemoryStick } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import LoginModal from "./LoginModal";
import {
  getProxmoxContainers,
  getStoredToken,
  type ProxmoxGuest,
} from "../lib/api";

const formatBytes = (bytes?: number): string => {
  if (!bytes || bytes <= 0) {
    return "0 GB";
  }

  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
};

const formatPercent = (value?: number): string => {
  if (value === undefined) {
    return "0%";
  }

  return `${Math.round(value * 100)}%`;
};

const getStatusTone = (status?: string): string => {
  if (status === "running") {
    return "border-emerald-400/15 bg-emerald-400/10 text-emerald-100";
  }

  return "border-white/8 bg-[#161616] text-zinc-400";
};

function ContainerMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Cpu;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm">
      <div className="flex items-center gap-2 text-zinc-500">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className="mt-1 font-mono text-zinc-100">{value}</p>
    </div>
  );
}

export default function ContenedoresWorkspace() {
  const [containers, setContainers] = useState<ProxmoxGuest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!getStoredToken()) {
      setNeedsLogin(true);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError("");

    getProxmoxContainers()
      .then((items) => {
        if (!isMounted) {
          return;
        }

        setContainers(items);
        setNeedsLogin(false);
      })
      .catch((requestError) => {
        if (!isMounted) {
          return;
        }

        const message =
          requestError instanceof Error ? requestError.message : "Error al conectar con Nexo Backend";
        setError(message);
        setNeedsLogin(message.includes("Token invalido"));
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const counts = useMemo(
    () => ({
      total: containers.length,
      running: containers.filter((container) => container.status === "running").length,
      stopped: containers.filter((container) => container.status !== "running").length,
    }),
    [containers],
  );

  return (
    <>
      {needsLogin ? <LoginModal onLogin={() => setRefreshKey((current) => current + 1)} /> : null}

      <div className="space-y-6">
        <section className="panel rounded-[18px] p-4">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">
                Contenedores
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-zinc-100">
                Contenedores LXC de Proxmox
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                Inventario real desde el cluster Proxmox conectado a Nexo Backend.
              </p>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between rounded-xl border border-white/8 bg-[#161616] px-3 py-2.5 text-sm">
                <span className="text-zinc-400">Contenedores</span>
                <span className="font-mono text-zinc-100">{counts.total}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/8 bg-[#161616] px-3 py-2.5 text-sm">
                <span className="text-zinc-400">Running</span>
                <span className="font-mono text-zinc-100">{counts.running}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/8 bg-[#161616] px-3 py-2.5 text-sm">
                <span className="text-zinc-400">Detenidos</span>
                <span className="font-mono text-zinc-100">{counts.stopped}</span>
              </div>
            </div>
          </div>
        </section>

        {error ? (
          <section className="rounded-[18px] border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-100">
            {error.includes("Token invalido") ? "Token invalido, volver a iniciar sesion" : "Error al conectar con Nexo Backend"}
          </section>
        ) : null}

        <section className="panel rounded-[18px] p-4">
          {isLoading ? (
            <div className="text-sm text-zinc-400">Cargando...</div>
          ) : null}

          {!isLoading && containers.length === 0 ? (
            <div className="rounded-[18px] border border-dashed border-white/10 bg-[#101010] px-4 py-12 text-center">
              <Boxes className="mx-auto h-7 w-7 text-zinc-600" />
              <p className="mt-3 text-sm text-zinc-400">No hay contenedores LXC disponibles.</p>
            </div>
          ) : null}

          <div className="grid gap-4">
            {containers.map((container) => (
              <article key={container.id} className="rounded-[18px] border border-white/8 bg-[#161616] p-4">
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/8 bg-[#101010] px-3 py-1 text-xs font-mono text-zinc-300">
                        CT {container.vmid}
                      </span>
                      <span className={`rounded-full border px-3 py-1 text-xs ${getStatusTone(container.status)}`}>
                        {container.status ?? "unknown"}
                      </span>
                      <span className="rounded-full border border-white/8 bg-[#101010] px-3 py-1 text-xs text-zinc-300">
                        {container.node ?? "sin nodo"}
                      </span>
                    </div>

                    <h3 className="mt-3 truncate text-xl font-semibold text-zinc-100">
                      {container.name ?? `LXC ${container.vmid}`}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">{container.id}</p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <ContainerMetric icon={Cpu} label="CPU" value={`${container.maxcpu ?? 0} cores / ${formatPercent(container.cpu)}`} />
                    <ContainerMetric icon={MemoryStick} label="RAM usada" value={formatBytes(container.mem)} />
                    <ContainerMetric icon={MemoryStick} label="RAM maxima" value={formatBytes(container.maxmem)} />
                    <ContainerMetric icon={HardDrive} label="Disco" value={`${formatBytes(container.disk)} / ${formatBytes(container.maxdisk)}`} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
