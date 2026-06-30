"use client";

import { Cpu, HardDrive, MemoryStick, Server } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import LoginModal from "./LoginModal";
import RefreshIndicator from "./RefreshIndicator";
import {
  getProxmoxVMs,
  getStoredToken,
  type ProxmoxGuest,
} from "../lib/api";
import { useNexoPolling } from "../lib/useNexoPolling";

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

function VmMetric({
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

export default function MaquinasVirtualesWorkspace() {
  const [needsLogin, setNeedsLogin] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const enabled = !needsLogin;

  useEffect(() => {
    setNeedsLogin(!getStoredToken());
  }, [refreshKey]);

  const fetchVms = useCallback(() => getProxmoxVMs(), []);
  const vmsState = useNexoPolling(fetchVms, { enabled, intervalMs: 15000, refreshKey });
  const vms = vmsState.data ?? [];

  useEffect(() => {
    if (vmsState.error.includes("Token invalido")) {
      setNeedsLogin(true);
    }
  }, [vmsState.error]);

  const counts = useMemo(
    () => ({
      total: vms.length,
      running: vms.filter((vm) => vm.status === "running").length,
      stopped: vms.filter((vm) => vm.status !== "running").length,
    }),
    [vms],
  );

  return (
    <>
      {needsLogin ? <LoginModal onLogin={() => setRefreshKey((current) => current + 1)} /> : null}

      <div className="space-y-6">
        <section className="panel rounded-[18px] p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">
                  Proxmox
                </p>
                <RefreshIndicator lastUpdatedAt={vmsState.lastUpdatedAt} isFresh={vmsState.isFresh} />
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-zinc-100">
                Control de maquinas virtuales
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                Inventario real desde Nexo Backend y Proxmox.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="rounded-xl border border-white/8 bg-[#161616] px-3 py-2.5 text-sm">
                <span className="text-zinc-500">Total</span>
                <span className="ml-3 font-mono text-zinc-100">{counts.total}</span>
              </div>
              <div className="rounded-xl border border-white/8 bg-[#161616] px-3 py-2.5 text-sm">
                <span className="text-zinc-500">Running</span>
                <span className="ml-3 font-mono text-zinc-100">{counts.running}</span>
              </div>
              <div className="rounded-xl border border-white/8 bg-[#161616] px-3 py-2.5 text-sm">
                <span className="text-zinc-500">Detenidas</span>
                <span className="ml-3 font-mono text-zinc-100">{counts.stopped}</span>
              </div>
            </div>
          </div>
        </section>

        {vmsState.error ? (
          <section className="rounded-[18px] border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-100">
            {vmsState.error.includes("Token invalido") ? "Token invalido, volver a iniciar sesion" : "Error al conectar con Nexo Backend"}
          </section>
        ) : null}

        <section className="panel rounded-[18px] p-4">
          {vmsState.isLoading ? (
            <div className="text-sm text-zinc-400">Cargando...</div>
          ) : null}

          {!vmsState.isLoading && vms.length === 0 ? (
            <div className="rounded-[18px] border border-dashed border-white/10 bg-[#101010] px-4 py-10 text-center text-sm text-zinc-500">
              No hay maquinas virtuales disponibles.
            </div>
          ) : null}

          <div className="grid gap-4">
            {vms.map((vm) => (
              <article key={vm.id} className="rounded-[18px] border border-white/8 bg-[#161616] p-4">
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/8 bg-[#101010] px-3 py-1 text-xs font-mono text-zinc-300">
                        VMID {vm.vmid}
                      </span>
                      <span className={`rounded-full border px-3 py-1 text-xs ${getStatusTone(vm.status)}`}>
                        {vm.status ?? "unknown"}
                      </span>
                      <span className="rounded-full border border-white/8 bg-[#101010] px-3 py-1 text-xs text-zinc-300">
                        {vm.node ?? "sin nodo"}
                      </span>
                    </div>

                    <h3 className="mt-3 truncate text-xl font-semibold text-zinc-100">
                      {vm.name ?? `VM ${vm.vmid}`}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">{vm.id}</p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <VmMetric icon={Cpu} label="CPU" value={`${vm.maxcpu ?? 0} cores / ${formatPercent(vm.cpu)}`} />
                    <VmMetric icon={MemoryStick} label="RAM usada" value={formatBytes(vm.mem)} />
                    <VmMetric icon={MemoryStick} label="RAM maxima" value={formatBytes(vm.maxmem)} />
                    <VmMetric icon={HardDrive} label="Disco" value={`${formatBytes(vm.disk)} / ${formatBytes(vm.maxdisk)}`} />
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
