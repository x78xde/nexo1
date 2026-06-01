"use client";

import {
  Ellipsis,
  ImagePlus,
  Play,
  RotateCcw,
  Search,
  Server,
  Square,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type VmStatus = "Online" | "Apagada" | "Suspendida";
type VmAction = "Encender" | "Apagar" | "Reiniciar";

type VmLog = {
  id: string;
  message: string;
  time: string;
  type: "accion" | "sistema" | "alerta";
};

type VmHistoryPoint = {
  label: string;
  cpu: number;
  ram: number;
  disk: number;
};

type VmThumbnail = {
  id: string;
  label: string;
  accent: string;
};

type VmItem = {
  id: string;
  name: string;
  os: string;
  node: string;
  status: VmStatus;
  cpu: string;
  ram: string;
  disk: string;
  uptime: string;
  cpuLoad: number;
  ramLoad: number;
  diskLoad: number;
  history: VmHistoryPoint[];
  thumbnail: VmThumbnail;
  recentActions: string[];
  logs: VmLog[];
};

type PreviewAction =
  | { type: "search" }
  | { type: "thumbnail"; vm: VmItem }
  | { type: "details"; vm: VmItem };

const thumbnailOptions: VmThumbnail[] = [
  {
    id: "ubuntu",
    label: "Ubuntu",
    accent:
      "from-zinc-800 via-zinc-900 to-black before:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_50%)]",
  },
  {
    id: "nexo",
    label: "NEXO",
    accent:
      "from-zinc-700 via-zinc-800 to-zinc-950 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%)]",
  },
  {
    id: "minecraft",
    label: "Minecraft",
    accent:
      "from-emerald-900 via-zinc-900 to-black before:bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_55%)]",
  },
  {
    id: "windows",
    label: "Windows",
    accent:
      "from-sky-950 via-zinc-900 to-black before:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_40%)]",
  },
];

const initialVms: VmItem[] = [
  {
    id: "vm-nexo",
    name: "vm-nexo",
    os: "Ubuntu Server 24.04",
    node: "pve",
    status: "Online",
    cpu: "2 cores",
    ram: "4 GB",
    disk: "60 GB",
    uptime: "16d 08h",
    cpuLoad: 27,
    ramLoad: 54,
    diskLoad: 48,
    history: [
      { label: "08:00", cpu: 18, ram: 46, disk: 46 },
      { label: "10:00", cpu: 24, ram: 49, disk: 47 },
      { label: "12:00", cpu: 31, ram: 53, disk: 47 },
      { label: "14:00", cpu: 22, ram: 51, disk: 48 },
      { label: "16:00", cpu: 28, ram: 55, disk: 48 },
      { label: "18:00", cpu: 27, ram: 54, disk: 48 },
    ],
    thumbnail: thumbnailOptions[1],
    recentActions: ["Reinicio de servicios", "Revision de logs", "Tunnel verificado"],
    logs: [
      { id: "log-1", message: "VM iniciada correctamente", time: "Hoy 09:14", type: "sistema" },
      { id: "log-2", message: "Cloudflare Tunnel activo", time: "Hoy 10:28", type: "accion" },
      { id: "log-3", message: "Uso alto de disco temporal", time: "Ayer 21:06", type: "alerta" },
    ],
  },
  {
    id: "ubuntu-dev",
    name: "ubuntu-dev",
    os: "Ubuntu Server 22.04",
    node: "pve",
    status: "Online",
    cpu: "4 cores",
    ram: "6 GB",
    disk: "90 GB",
    uptime: "4d 03h",
    cpuLoad: 41,
    ramLoad: 63,
    diskLoad: 56,
    history: [
      { label: "08:00", cpu: 35, ram: 56, disk: 54 },
      { label: "10:00", cpu: 39, ram: 58, disk: 55 },
      { label: "12:00", cpu: 51, ram: 66, disk: 55 },
      { label: "14:00", cpu: 38, ram: 61, disk: 56 },
      { label: "16:00", cpu: 44, ram: 64, disk: 56 },
      { label: "18:00", cpu: 41, ram: 63, disk: 56 },
    ],
    thumbnail: thumbnailOptions[0],
    recentActions: ["Pull de proyecto", "Build completado", "Cache limpiada"],
    logs: [
      { id: "log-4", message: "Build finalizado sin errores", time: "Hoy 12:08", type: "accion" },
      { id: "log-5", message: "Reinicio de contenedor dev", time: "Hoy 12:21", type: "sistema" },
      { id: "log-6", message: "Uso estable de RAM", time: "Ayer 22:50", type: "sistema" },
    ],
  },
  {
    id: "mc-survival",
    name: "mc-survival",
    os: "Debian 12",
    node: "pve",
    status: "Apagada",
    cpu: "4 cores",
    ram: "8 GB",
    disk: "120 GB",
    uptime: "0h",
    cpuLoad: 0,
    ramLoad: 0,
    diskLoad: 71,
    history: [
      { label: "08:00", cpu: 0, ram: 0, disk: 70 },
      { label: "10:00", cpu: 0, ram: 0, disk: 70 },
      { label: "12:00", cpu: 8, ram: 12, disk: 71 },
      { label: "14:00", cpu: 3, ram: 8, disk: 71 },
      { label: "16:00", cpu: 0, ram: 0, disk: 71 },
      { label: "18:00", cpu: 0, ram: 0, disk: 71 },
    ],
    thumbnail: thumbnailOptions[2],
    recentActions: ["Backups revisados", "Plugins actualizados", "VM apagada manualmente"],
    logs: [
      { id: "log-7", message: "VM apagada por admin", time: "Hoy 01:18", type: "accion" },
      { id: "log-8", message: "Backup de mundo listo", time: "Ayer 23:12", type: "sistema" },
      { id: "log-9", message: "Sin jugadores conectados", time: "Ayer 22:48", type: "alerta" },
    ],
  },
];

function getStatusTone(status: VmStatus) {
  if (status === "Online") {
    return "border-emerald-400/15 bg-emerald-400/10 text-emerald-100";
  }

  if (status === "Suspendida") {
    return "border-amber-400/15 bg-amber-400/10 text-amber-100";
  }

  return "border-white/8 bg-[#161616] text-zinc-400";
}

function getLogTone(type: VmLog["type"]) {
  if (type === "accion") {
    return "bg-sky-400/70";
  }

  if (type === "alerta") {
    return "bg-amber-400/80";
  }

  return "bg-zinc-500";
}

function MetricBar({
  label,
  value,
  percent,
}: {
  label: string;
  value: string;
  percent: number;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-[#101010] px-3 py-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-500">{label}</span>
        <span className="font-mono text-zinc-100">{value}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#171717]">
        <div className="h-full rounded-full bg-zinc-300" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function ResourceTimeline({ vm }: { vm: VmItem }) {
  const width = 460;
  const height = 184;
  const paddingX = 18;
  const paddingTop = 18;
  const paddingBottom = 28;
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingTop - paddingBottom;

  const getPoints = (key: "cpu" | "ram" | "disk") =>
    vm.history
      .map((point, index) => {
        const x =
          paddingX +
          (vm.history.length === 1 ? usableWidth / 2 : (usableWidth / (vm.history.length - 1)) * index);
        const y = paddingTop + usableHeight - (point[key] / 100) * usableHeight;
        return `${x},${y}`;
      })
      .join(" ");

  const series = [
    { key: "cpu" as const, label: "CPU", tone: "#f5f5f5", value: vm.cpuLoad },
    { key: "ram" as const, label: "RAM", tone: "#a1a1aa", value: vm.ramLoad },
    { key: "disk" as const, label: "Disco", tone: "#71717a", value: vm.diskLoad },
  ];

  return (
    <section className="rounded-[18px] border border-white/8 bg-[#161616] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-zinc-100">Uso de recursos</p>
          <p className="mt-1 text-sm text-zinc-500">Lectura detallada por tramo reciente</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {series.map((item) => (
            <div
              key={item.key}
              className="rounded-xl border border-white/8 bg-[#101010] px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.tone }}
                />
                <span className="text-zinc-500">{item.label}</span>
                <span className="font-mono text-zinc-100">{item.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[18px] border border-white/8 bg-[#101010] p-3">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-[220px] w-full">
          {[0, 25, 50, 75, 100].map((mark) => {
            const y = paddingTop + usableHeight - (mark / 100) * usableHeight;

            return (
              <g key={mark}>
                <line
                  x1={paddingX}
                  x2={width - paddingX}
                  y1={y}
                  y2={y}
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth="1"
                />
                <text
                  x={0}
                  y={y + 4}
                  fill="#6b7280"
                  fontSize="10"
                  className="font-mono"
                >
                  {mark}
                </text>
              </g>
            );
          })}

          {series.map((item) => (
            <polyline
              key={item.key}
              fill="none"
              stroke={item.tone}
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={getPoints(item.key)}
            />
          ))}

          {vm.history.map((point, index) => {
            const x =
              paddingX +
              (vm.history.length === 1 ? usableWidth / 2 : (usableWidth / (vm.history.length - 1)) * index);

            return (
              <text
                key={point.label}
                x={x}
                y={height - 6}
                textAnchor="middle"
                fill="#6b7280"
                fontSize="10"
                className="font-mono"
              >
                {point.label}
              </text>
            );
          })}
        </svg>
      </div>
    </section>
  );
}

function PreviewModal({
  action,
  onClose,
}: {
  action: PreviewAction | null;
  onClose: () => void;
}) {
  if (!action) {
    return null;
  }

  const vm = "vm" in action ? action.vm : null;
  const title =
    action.type === "search"
      ? "Buscar VM"
      : action.type === "thumbnail"
        ? "Cambiar miniatura"
        : "Detalle completo";

  const description =
    action.type === "search"
      ? "Preview del buscador por nombre, estado o sistema operativo."
      : action.type === "thumbnail"
        ? "Preview del selector de miniaturas o imagen principal para la VM."
        : "Preview del espacio completo de monitoreo de esta maquina virtual.";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 px-4 py-8 project-overlay">
      <div className="panel project-modal w-full max-w-xl rounded-[22px] p-5 shadow-[0_24px_64px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-base font-medium text-zinc-100">{title}</p>
            <p className="mt-1 text-sm text-zinc-400">{description}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/8 bg-[#161616] text-zinc-400 transition hover:text-zinc-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {action.type === "search" ? (
            <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
              <div className="rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm text-zinc-500">
                Buscar por nombre, estado o tipo de VM...
              </div>
            </div>
          ) : null}

          {vm ? (
            <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">VM</p>
              <p className="mt-2 text-sm font-medium text-zinc-100">{vm.name}</p>
              <p className="mt-1 text-sm text-zinc-500">{vm.os}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ThumbnailPicker({
  vm,
  isOpen,
  onClose,
  onSelect,
}: {
  vm: VmItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (thumbnail: VmThumbnail) => void;
}) {
  if (!isOpen || !vm) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 px-4 py-8 project-overlay">
      <div className="panel project-modal w-full max-w-2xl rounded-[22px] p-5 shadow-[0_24px_64px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-base font-medium text-zinc-100">Cambiar miniatura</p>
            <p className="mt-1 text-sm text-zinc-400">
              Elige una portada visual para {vm.name}. Luego esto se puede conectar a subida real.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/8 bg-[#161616] text-zinc-400 transition hover:text-zinc-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {thumbnailOptions.map((thumbnail) => (
            <button
              key={thumbnail.id}
              type="button"
              onClick={() => onSelect(thumbnail)}
              className="panel overflow-hidden rounded-[20px] p-0 text-left transition hover:border-white/14"
            >
              <div
                className={`relative h-28 bg-gradient-to-br ${thumbnail.accent} before:absolute before:inset-0 before:content-['']`}
              >
                <div className="relative flex h-full items-end p-4">
                  <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-zinc-100 backdrop-blur-sm">
                    {thumbnail.label}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function VmCardMenu({
  vm,
  onAction,
}: {
  vm: VmItem;
  onAction: (action: PreviewAction) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  const options = [
    { label: "Detalle", action: () => onAction({ type: "details", vm }) },
    { label: "Cambiar miniatura", action: () => onAction({ type: "thumbnail", vm }) },
  ];

  return (
    <div ref={menuRef} className="relative" onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="grid h-8 w-8 place-items-center rounded-xl border border-white/8 bg-[#161616] text-zinc-500 transition hover:text-zinc-200"
      >
        <Ellipsis className="h-4 w-4" />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-10 z-20 min-w-[160px] rounded-2xl border border-white/8 bg-[#161616] p-2 shadow-[0_12px_30px_rgba(0,0,0,0.34)]">
          <div className="space-y-1">
            {options.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  option.action();
                }}
                className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-zinc-300 transition hover:bg-[#222222] hover:text-zinc-100"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function MaquinasVirtualesWorkspace() {
  const [previewAction, setPreviewAction] = useState<PreviewAction | null>(null);
  const [vms, setVms] = useState(initialVms);
  const [selectedId, setSelectedId] = useState(initialVms[0]?.id ?? "");
  const [isThumbnailPickerOpen, setIsThumbnailPickerOpen] = useState(false);

  const selectedVm = vms.find((vm) => vm.id === selectedId) ?? initialVms[0] ?? null;

  const counts = useMemo(
    () => ({
      total: vms.length,
      online: vms.filter((vm) => vm.status === "Online").length,
      offline: vms.filter((vm) => vm.status === "Apagada").length,
    }),
    [vms],
  );

  const applyVmAction = (vmId: string, action: VmAction) => {
    const timestamp = "Hace unos segundos";

    setVms((current) =>
      current.map((vm) => {
        if (vm.id !== vmId) {
          return vm;
        }

        const nextStatus =
          action === "Encender" ? "Online" : action === "Apagar" ? "Apagada" : "Online";

        const nextLog: VmLog = {
          id: `log-${Date.now()}-${vmId}`,
          message: `${action} solicitado desde NEXO`,
          time: timestamp,
          type: "accion",
        };

        return {
          ...vm,
          status: nextStatus,
          uptime: action === "Apagar" ? "0h" : action === "Encender" ? "0h 02m" : vm.uptime,
          cpuLoad: action === "Apagar" ? 0 : vm.cpuLoad,
          ramLoad: action === "Apagar" ? 0 : vm.ramLoad,
          recentActions: [`${action} desde NEXO`, ...vm.recentActions].slice(0, 4),
          logs: [nextLog, ...vm.logs].slice(0, 6),
        };
      }),
    );
  };

  return (
    <>
      <div className="space-y-6">
        <section className="panel rounded-[18px] p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">
                Proxmox
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-zinc-100">
                Control de maquinas virtuales
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="rounded-xl border border-white/8 bg-[#161616] px-3 py-2.5 text-sm">
                <span className="text-zinc-500">Total</span>
                <span className="ml-3 font-mono text-zinc-100">{counts.total}</span>
              </div>
              <div className="rounded-xl border border-white/8 bg-[#161616] px-3 py-2.5 text-sm">
                <span className="text-zinc-500">Online</span>
                <span className="ml-3 font-mono text-zinc-100">{counts.online}</span>
              </div>
              <div className="rounded-xl border border-white/8 bg-[#161616] px-3 py-2.5 text-sm">
                <span className="text-zinc-500">Apagadas</span>
                <span className="ml-3 font-mono text-zinc-100">{counts.offline}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="panel rounded-[18px] p-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewAction({ type: "search" })}
              className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#161616] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#1d1d1d]"
            >
              <Search className="h-4 w-4" />
              Buscar
            </button>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_380px]">
            <div className="space-y-3">
              {vms.map((vm) => (
                <article
                  key={vm.id}
                  onClick={() => setSelectedId(vm.id)}
                  className={`rounded-[18px] border p-3 transition ${
                    selectedVm?.id === vm.id
                      ? "border-white/14 bg-[#1d1d1d]"
                      : "border-white/8 bg-[#161616] hover:border-white/14 hover:bg-[#1b1b1b]"
                  }`}
                >
                  <div className="grid gap-4 md:grid-cols-[86px_minmax(0,1fr)]">
                    <div
                      className={`relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br ${vm.thumbnail.accent} before:absolute before:inset-0 before:content-['']`}
                    >
                      <div className="relative flex h-full min-h-[86px] items-end p-3">
                        <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1 text-[0.64rem] uppercase tracking-[0.16em] text-zinc-100 backdrop-blur-sm">
                          {vm.thumbnail.label}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-3 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-zinc-100">{vm.name}</h3>
                            <span className={`rounded-full border px-3 py-1 text-xs ${getStatusTone(vm.status)}`}>
                              {vm.status}
                            </span>
                            <span className="rounded-full border border-white/8 bg-[#101010] px-3 py-1 text-xs text-zinc-300">
                              {vm.node}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-zinc-400">{vm.os}</p>
                        </div>

                        <VmCardMenu
                          vm={vm}
                          onAction={(action) => {
                            if (action.type === "thumbnail") {
                              setSelectedId(vm.id);
                              setIsThumbnailPickerOpen(true);
                            } else {
                              setPreviewAction(action);
                            }
                          }}
                        />
                      </div>

                      <div className="grid gap-2 md:grid-cols-2 2xl:grid-cols-4">
                        <div className="min-w-0 rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm">
                          <p className="text-zinc-500">CPU</p>
                          <p className="mt-1 font-mono text-zinc-100">{vm.cpu}</p>
                        </div>
                        <div className="min-w-0 rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm">
                          <p className="text-zinc-500">RAM</p>
                          <p className="mt-1 font-mono text-zinc-100">{vm.ram}</p>
                        </div>
                        <div className="min-w-0 rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm">
                          <p className="text-zinc-500">Disco</p>
                          <p className="mt-1 font-mono text-zinc-100">{vm.disk}</p>
                        </div>
                        <div className="min-w-0 rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm">
                          <p className="text-zinc-500">Uptime</p>
                          <p className="mt-1 font-mono text-zinc-100">{vm.uptime}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            applyVmAction(vm.id, "Encender");
                          }}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#101010] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#151515] hover:text-zinc-100"
                        >
                          <Play className="h-4 w-4" />
                          Encender
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            applyVmAction(vm.id, "Apagar");
                          }}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#101010] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#151515] hover:text-zinc-100"
                        >
                          <Square className="h-4 w-4" />
                          Apagar
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            applyVmAction(vm.id, "Reiniciar");
                          }}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#101010] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#151515] hover:text-zinc-100"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Reiniciar
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {selectedVm ? (
              <aside className="space-y-5">
                <section className="rounded-[18px] border border-white/8 bg-[#161616] p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br ${selectedVm.thumbnail.accent} before:absolute before:inset-0 before:content-['']`}
                    >
                      <div className="relative grid h-full place-items-center text-zinc-100">
                        <Server className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-medium text-zinc-100">{selectedVm.name}</p>
                        <span className={`rounded-full border px-3 py-1 text-xs ${getStatusTone(selectedVm.status)}`}>
                          {selectedVm.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-zinc-400">{selectedVm.os}</p>
                      <button
                        type="button"
                        onClick={() => setIsThumbnailPickerOpen(true)}
                        className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#101010] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#151515] hover:text-zinc-100"
                      >
                        <ImagePlus className="h-4 w-4" />
                        Cambiar miniatura
                      </button>
                    </div>
                  </div>
                </section>

                <section className="rounded-[18px] border border-white/8 bg-[#161616] p-4">
                  <div className="grid gap-3">
                    <MetricBar label="CPU host" value={`${selectedVm.cpuLoad}%`} percent={selectedVm.cpuLoad} />
                    <MetricBar label="RAM usada" value={`${selectedVm.ramLoad}%`} percent={selectedVm.ramLoad} />
                    <MetricBar label="Disco usado" value={`${selectedVm.diskLoad}%`} percent={selectedVm.diskLoad} />
                  </div>
                </section>

                <ResourceTimeline vm={selectedVm} />

                <section className="rounded-[18px] border border-white/8 bg-[#161616] p-4">
                  <p className="text-sm font-medium text-zinc-100">Acciones rapidas</p>
                  <div className="mt-4 grid gap-2">
                    <button
                      type="button"
                      onClick={() => applyVmAction(selectedVm.id, "Encender")}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-[#151515] hover:text-zinc-100"
                    >
                      <Play className="h-4 w-4" />
                      Encender VM
                    </button>
                    <button
                      type="button"
                      onClick={() => applyVmAction(selectedVm.id, "Apagar")}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-[#151515] hover:text-zinc-100"
                    >
                      <Square className="h-4 w-4" />
                      Apagar VM
                    </button>
                    <button
                      type="button"
                      onClick={() => applyVmAction(selectedVm.id, "Reiniciar")}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-[#151515] hover:text-zinc-100"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reiniciar VM
                    </button>
                  </div>
                </section>

                <section className="rounded-[18px] border border-white/8 bg-[#161616] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-zinc-100">Acciones recientes</p>
                    <span className="text-xs text-zinc-500">{selectedVm.recentActions.length}</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    {selectedVm.recentActions.map((action) => (
                      <div
                        key={action}
                        className="rounded-xl border border-white/8 bg-[#101010] px-3 py-3 text-sm text-zinc-300"
                      >
                        {action}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-[18px] border border-white/8 bg-[#161616] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-zinc-100">Logs</p>
                    <span className="text-xs text-zinc-500">{selectedVm.logs.length} eventos</span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {selectedVm.logs.map((log) => (
                      <div
                        key={log.id}
                        className="flex gap-3 rounded-xl border border-white/8 bg-[#101010] px-3 py-3 text-sm"
                      >
                        <div className={`mt-1 h-2.5 w-2.5 rounded-full ${getLogTone(log.type)}`} />
                        <div className="min-w-0">
                          <p className="text-zinc-100">{log.message}</p>
                          <p className="mt-1 text-zinc-500">{log.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </aside>
            ) : null}
          </div>
        </section>
      </div>

      <ThumbnailPicker
        vm={selectedVm}
        isOpen={isThumbnailPickerOpen}
        onClose={() => setIsThumbnailPickerOpen(false)}
        onSelect={(thumbnail) => {
          if (!selectedVm) {
            return;
          }

          setVms((current) =>
            current.map((vm) => (vm.id === selectedVm.id ? { ...vm, thumbnail } : vm)),
          );
          setIsThumbnailPickerOpen(false);
        }}
      />
      <PreviewModal action={previewAction} onClose={() => setPreviewAction(null)} />
    </>
  );
}
