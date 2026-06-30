"use client";

import { Activity, Cpu, HardDriveDownload, Server } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import LoginModal from "./components/LoginModal";
import MetricCard from "./components/MetricCard";
import RefreshIndicator from "./components/RefreshIndicator";
import {
  getBackendStatus,
  getProxmoxContainers,
  getProxmoxNodes,
  getProxmoxStorage,
  getProxmoxVersion,
  getProxmoxVMs,
  getStoredToken,
  getSystemMetrics,
  type ProxmoxStorage,
} from "./lib/api";
import { useNexoPolling } from "./lib/useNexoPolling";

const formatBytes = (bytes?: number): string => {
  if (!bytes || bytes <= 0) {
    return "0 GB";
  }

  const value = bytes / 1024 / 1024 / 1024;
  return `${value >= 100 ? Math.round(value) : value.toFixed(1)} GB`;
};

const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }

  return `${hours}h ${minutes}m`;
};

const percent = (used?: number, total?: number): number => {
  if (!used || !total || total <= 0) {
    return 0;
  }

  return Math.round((used / total) * 100);
};

const getPrimaryStorage = (storages: ProxmoxStorage[]): ProxmoxStorage | null => {
  const available = storages.filter((storage) => storage.total && storage.total > 0);

  return (
    available.find((storage) => storage.storage === "local-lvm") ??
    available.find((storage) => storage.storage === "local") ??
    available[0] ??
    null
  );
};

export default function Home() {
  const [needsLogin, setNeedsLogin] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const enabled = !needsLogin;

  useEffect(() => {
    setNeedsLogin(!getStoredToken());
  }, [refreshKey]);

  const backendFetch = useCallback(() => getBackendStatus(), []);
  const metricsFetch = useCallback(() => getSystemMetrics(), []);
  const versionFetch = useCallback(() => getProxmoxVersion(), []);
  const nodesFetch = useCallback(() => getProxmoxNodes(), []);
  const storageFetch = useCallback(() => getProxmoxStorage(), []);
  const vmsFetch = useCallback(() => getProxmoxVMs(), []);
  const containersFetch = useCallback(() => getProxmoxContainers(), []);

  const backend = useNexoPolling(backendFetch, { enabled, refreshKey });
  const metrics = useNexoPolling(metricsFetch, { enabled, intervalMs: 5000, refreshKey });
  const version = useNexoPolling(versionFetch, { enabled, refreshKey });
  const nodes = useNexoPolling(nodesFetch, { enabled, intervalMs: 10000, refreshKey });
  const storage = useNexoPolling(storageFetch, { enabled, intervalMs: 30000, refreshKey });
  const vms = useNexoPolling(vmsFetch, { enabled, intervalMs: 15000, refreshKey });
  const containers = useNexoPolling(containersFetch, { enabled, intervalMs: 15000, refreshKey });

  const firstError = useMemo(
    () =>
      [
        backend.error,
        metrics.error,
        version.error,
        nodes.error,
        storage.error,
        vms.error,
        containers.error,
      ].find(Boolean) ?? "",
    [backend.error, containers.error, metrics.error, nodes.error, storage.error, version.error, vms.error],
  );

  useEffect(() => {
    if (firstError.includes("Token invalido")) {
      setNeedsLogin(true);
    }
  }, [firstError]);

  const isLoading =
    backend.isLoading ||
    metrics.isLoading ||
    version.isLoading ||
    nodes.isLoading ||
    storage.isLoading ||
    vms.isLoading ||
    containers.isLoading;

  const lastUpdatedAt = Math.max(
    backend.lastUpdatedAt ?? 0,
    metrics.lastUpdatedAt ?? 0,
    version.lastUpdatedAt ?? 0,
    nodes.lastUpdatedAt ?? 0,
    storage.lastUpdatedAt ?? 0,
    vms.lastUpdatedAt ?? 0,
    containers.lastUpdatedAt ?? 0,
  );

  const isFresh =
    backend.isFresh ||
    metrics.isFresh ||
    version.isFresh ||
    nodes.isFresh ||
    storage.isFresh ||
    vms.isFresh ||
    containers.isFresh;

  const primaryNode = nodes.data?.[0] ?? null;
  const primaryStorage = useMemo(() => getPrimaryStorage(storage.data ?? []), [storage.data]);
  const nodeMemoryUsage = percent(primaryNode?.mem, primaryNode?.maxmem);
  const storageUsage = percent(primaryStorage?.used, primaryStorage?.total);
  const nodeCpuUsage = primaryNode?.cpu
    ? Math.round(primaryNode.cpu * 100)
    : metrics.data?.cpu.usage ?? 0;

  const storageRows = useMemo(
    () => [
      {
        label: "RAM nodo",
        value: `${formatBytes(primaryNode?.mem)} / ${formatBytes(primaryNode?.maxmem)}`,
        width: `${nodeMemoryUsage}%`,
      },
      {
        label: `Storage ${primaryStorage?.storage ?? "Proxmox"}`,
        value: `${formatBytes(primaryStorage?.used)} / ${formatBytes(primaryStorage?.total)}`,
        width: `${storageUsage}%`,
      },
      {
        label: "RAM sistema",
        value: metrics.data
          ? `${formatBytes(metrics.data.memory.used)} / ${formatBytes(metrics.data.memory.total)}`
          : "0 GB / 0 GB",
        width: `${metrics.data?.memory.usage ?? 0}%`,
      },
    ],
    [metrics.data, nodeMemoryUsage, primaryNode, primaryStorage, storageUsage],
  );

  return (
    <>
      {needsLogin ? <LoginModal onLogin={() => setRefreshKey((current) => current + 1)} /> : null}

      <div className="space-y-6">
        <section className="panel rounded-[18px] p-4">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">
                  Resumen
                </p>
                <RefreshIndicator lastUpdatedAt={lastUpdatedAt || null} isFresh={isFresh} />
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-zinc-100">
                Estado general del servidor
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                Lecturas reales con intervalos ligeros desde Nexo Backend, Proxmox y el sistema local.
              </p>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between rounded-xl border border-white/8 bg-[#161616] px-3 py-2.5 text-sm">
                <span className="text-zinc-400">Backend</span>
                <span className="font-mono text-zinc-100">
                  {backend.isLoading ? "Cargando..." : backend.data?.status ?? "Sin conexion"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/8 bg-[#161616] px-3 py-2.5 text-sm">
                <span className="text-zinc-400">Proxmox</span>
                <span className="font-mono text-zinc-100">
                  {version.data
                    ? `${version.data.version} (${version.data.release ?? "release"})`
                    : "Cargando..."}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/8 bg-[#161616] px-3 py-2.5 text-sm">
                <span className="text-zinc-400">Uptime</span>
                <span className="font-mono text-zinc-100">
                  {metrics.data ? formatUptime(metrics.data.uptime) : "Cargando..."}
                </span>
              </div>
            </div>
          </div>
        </section>

        {firstError ? (
          <section className="rounded-[18px] border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-100">
            {firstError.includes("Token invalido")
              ? "Token invalido, volver a iniciar sesion"
              : "Error al conectar con Nexo Backend"}
          </section>
        ) : null}

        {isLoading ? (
          <section className="panel rounded-[18px] p-4 text-sm text-zinc-400">Cargando...</section>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <MetricCard
            title="CPU nodo"
            value={`${nodeCpuUsage}%`}
            change={`${primaryNode?.maxcpu ?? metrics.data?.cpu.cores ?? 0} cores`}
            icon={Cpu}
            trend={[nodeCpuUsage, nodeCpuUsage + 4, nodeCpuUsage + 8, nodeCpuUsage + 2, nodeCpuUsage]}
          />
          <MetricCard
            title="Memoria nodo"
            value={`${formatBytes(primaryNode?.mem)} / ${formatBytes(primaryNode?.maxmem)}`}
            change={`${nodeMemoryUsage}% usado`}
            icon={Activity}
            trend={[nodeMemoryUsage, nodeMemoryUsage + 1, nodeMemoryUsage + 2, nodeMemoryUsage]}
          />
          <MetricCard
            title="Storage Proxmox"
            value={`${formatBytes(primaryStorage?.used)} / ${formatBytes(primaryStorage?.total)}`}
            change={`${storageUsage}% usado`}
            icon={HardDriveDownload}
          />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <article className="panel rounded-[18px] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-base font-medium text-zinc-100">Nodo Proxmox</p>
                <p className="mt-1 text-sm text-zinc-500">
                  {primaryNode ? `${primaryNode.node} - ${primaryNode.status}` : "Sin nodo detectado"}
                </p>
              </div>
              <span className="rounded-full border border-white/8 bg-[#161616] px-3 py-1 text-xs text-zinc-300">
                {nodes.data?.length ?? 0} nodo(s)
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {storageRows.map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-zinc-300">{row.label}</span>
                    <span className="font-mono text-zinc-400">{row.value}</span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#141414]">
                    <div
                      className="h-full rounded-full bg-[#717171] transition-all duration-700 ease-out"
                      style={{ width: row.width }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel rounded-[18px] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-base font-medium text-zinc-100">Inventario real</p>
                <p className="mt-1 text-sm text-zinc-500">Recursos detectados por Proxmox</p>
              </div>
              <Server className="h-5 w-5 text-zinc-500" />
            </div>

            <div className="mt-5 grid gap-3">
              <div className="flex items-center justify-between rounded-xl border border-white/8 bg-[#161616] px-3 py-3 text-sm">
                <span className="text-zinc-400">Maquinas virtuales</span>
                <span className="font-mono text-zinc-100 transition-all duration-500">
                  {vms.data?.length ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/8 bg-[#161616] px-3 py-3 text-sm">
                <span className="text-zinc-400">Contenedores LXC</span>
                <span className="font-mono text-zinc-100 transition-all duration-500">
                  {containers.data?.length ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/8 bg-[#161616] px-3 py-3 text-sm">
                <span className="text-zinc-400">Storage elegido</span>
                <span className="font-mono text-zinc-100">{primaryStorage?.storage ?? "N/D"}</span>
              </div>
            </div>
          </article>
        </section>
      </div>
    </>
  );
}
