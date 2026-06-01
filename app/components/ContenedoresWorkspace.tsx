"use client";

import {
  Bot,
  Boxes,
  Database,
  Globe,
  Play,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Square,
  TerminalSquare,
  Wrench,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type ContainerStatus = "Activo" | "Detenido" | "Mantenimiento";
type ContainerAction = "Iniciar" | "Detener" | "Reiniciar";
type ContainerCategory = "Produccion" | "Bots" | "Utilidades";
type ContainerVisualIcon = "bot" | "shield" | "database" | "terminal" | "globe" | "wrench";

type HostNode = {
  id: string;
  name: string;
  role: string;
  zone: string;
  ip: string;
  status: "Operativo" | "Reserva";
};

type ContainerLog = {
  id: string;
  message: string;
  time: string;
  type: "accion" | "sistema" | "alerta";
};

type ContainerVisual = {
  id: string;
  label: string;
  accent: string;
  icon: ContainerVisualIcon;
};

type ContainerItem = {
  id: string;
  name: string;
  service: string;
  hostId: string;
  category: ContainerCategory;
  status: ContainerStatus;
  visual: ContainerVisual;
  cpuLoad: number;
  ramLoad: number;
  diskLoad: number;
  uptime: string;
  ports: string[];
  stack: string[];
  lastEvent: string;
  recentActions: string[];
  logs: ContainerLog[];
};

type PreviewAction =
  | { type: "search" }
  | { type: "new-container" }
  | { type: "change-visual"; container: ContainerItem };

const hostNodes: HostNode[] = [
  {
    id: "srv-nexo",
    name: "srv-nexo",
    role: "Host principal",
    zone: "Rack local",
    ip: "192.168.1.40",
    status: "Operativo",
  },
  {
    id: "srv-bots",
    name: "srv-bots",
    role: "Servicios ligeros",
    zone: "Nodo auxiliar",
    ip: "192.168.1.52",
    status: "Operativo",
  },
  {
    id: "srv-lab",
    name: "srv-lab",
    role: "Pruebas y staging",
    zone: "Nodo secundario",
    ip: "192.168.1.61",
    status: "Reserva",
  },
];

const visualOptions: ContainerVisual[] = [
  {
    id: "discord",
    label: "Discord",
    accent:
      "from-indigo-950 via-zinc-900 to-black before:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_55%)]",
    icon: "bot",
  },
  {
    id: "proxy",
    label: "Proxy",
    accent:
      "from-cyan-950 via-zinc-900 to-black before:bg-[linear-gradient(135deg,rgba(255,255,255,0.07),transparent_48%)]",
    icon: "globe",
  },
  {
    id: "db",
    label: "DB",
    accent:
      "from-emerald-950 via-zinc-900 to-black before:bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_55%)]",
    icon: "database",
  },
  {
    id: "secure",
    label: "Guard",
    accent:
      "from-zinc-700 via-zinc-900 to-black before:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_42%)]",
    icon: "shield",
  },
  {
    id: "lab",
    label: "Lab",
    accent:
      "from-amber-950 via-zinc-900 to-black before:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_58%)]",
    icon: "terminal",
  },
  {
    id: "worker",
    label: "Worker",
    accent:
      "from-rose-950 via-zinc-900 to-black before:bg-[linear-gradient(135deg,rgba(255,255,255,0.07),transparent_48%)]",
    icon: "wrench",
  },
];

const initialContainers: ContainerItem[] = [
  {
    id: "ct-discord-bot",
    name: "discord-bot",
    service: "Bot de Discord",
    hostId: "srv-bots",
    category: "Bots",
    status: "Activo",
    visual: visualOptions[0],
    cpuLoad: 12,
    ramLoad: 34,
    diskLoad: 19,
    uptime: "7d 04h",
    ports: ["3001/tcp", "Webhook"],
    stack: ["Node.js", "Discord.js", "PM2"],
    lastEvent: "Mensajes sincronizados hace 2 min",
    recentActions: ["Comandos recargados", "Webhook validado", "Bot reiniciado"],
    logs: [
      { id: "c-log-1", message: "Heartbeat recibido por Discord API", time: "Hoy 12:08", type: "sistema" },
      { id: "c-log-2", message: "Slash commands desplegados", time: "Hoy 11:42", type: "accion" },
      { id: "c-log-3", message: "Rate limit leve controlado", time: "Ayer 23:14", type: "alerta" },
    ],
  },
  {
    id: "ct-cloudflare",
    name: "cf-tunnel",
    service: "Tunnel y proxy",
    hostId: "srv-nexo",
    category: "Produccion",
    status: "Activo",
    visual: visualOptions[1],
    cpuLoad: 8,
    ramLoad: 22,
    diskLoad: 14,
    uptime: "16d 08h",
    ports: ["443", "7844"],
    stack: ["Cloudflared", "Nginx"],
    lastEvent: "Tunnel publico estable",
    recentActions: ["Credenciales revisadas", "Rutas aplicadas", "Servicio comprobado"],
    logs: [
      { id: "c-log-4", message: "Tunnel sin perdida de enlace", time: "Hoy 12:13", type: "sistema" },
      { id: "c-log-5", message: "Regla de host actualizada", time: "Hoy 10:10", type: "accion" },
      { id: "c-log-6", message: "Certificado cacheado correctamente", time: "Ayer 20:55", type: "sistema" },
    ],
  },
  {
    id: "ct-auth-guard",
    name: "auth-guard",
    service: "Autenticacion ligera",
    hostId: "srv-nexo",
    category: "Produccion",
    status: "Mantenimiento",
    visual: visualOptions[3],
    cpuLoad: 6,
    ramLoad: 28,
    diskLoad: 17,
    uptime: "2d 18h",
    ports: ["8080"],
    stack: ["Fastify", "Redis"],
    lastEvent: "Reglas nuevas en revision",
    recentActions: ["Sesion limpiada", "Cache renovada", "Modo mantenimiento activo"],
    logs: [
      { id: "c-log-7", message: "Cambios de seguridad pendientes", time: "Hoy 08:40", type: "alerta" },
      { id: "c-log-8", message: "Servicio aislado para pruebas", time: "Hoy 08:16", type: "accion" },
      { id: "c-log-9", message: "Redis accesible en local", time: "Ayer 19:32", type: "sistema" },
    ],
  },
  {
    id: "ct-postgres-lab",
    name: "postgres-lab",
    service: "Base de datos de staging",
    hostId: "srv-lab",
    category: "Utilidades",
    status: "Detenido",
    visual: visualOptions[2],
    cpuLoad: 0,
    ramLoad: 0,
    diskLoad: 41,
    uptime: "0h",
    ports: ["5432"],
    stack: ["PostgreSQL", "pgBackRest"],
    lastEvent: "Contenedor listo para levantar",
    recentActions: ["Backup validado", "Snapshot limpio", "Contenedor detenido"],
    logs: [
      { id: "c-log-10", message: "Contenedor detenido manualmente", time: "Hoy 01:12", type: "accion" },
      { id: "c-log-11", message: "Volumen montado correctamente", time: "Ayer 22:50", type: "sistema" },
      { id: "c-log-12", message: "Sin conexiones activas", time: "Ayer 22:46", type: "alerta" },
    ],
  },
  {
    id: "ct-worker-sync",
    name: "worker-sync",
    service: "Sincronizacion interna",
    hostId: "srv-bots",
    category: "Utilidades",
    status: "Activo",
    visual: visualOptions[5],
    cpuLoad: 18,
    ramLoad: 26,
    diskLoad: 23,
    uptime: "3d 11h",
    ports: ["9000"],
    stack: ["Node.js", "BullMQ"],
    lastEvent: "Cola de tareas limpia",
    recentActions: ["Job nocturno completado", "Temporales borrados", "Queue revisada"],
    logs: [
      { id: "c-log-13", message: "Procesamiento de lote completado", time: "Hoy 07:56", type: "accion" },
      { id: "c-log-14", message: "Queue con retraso normalizado", time: "Hoy 07:42", type: "alerta" },
      { id: "c-log-15", message: "Worker estable tras reinicio", time: "Ayer 18:30", type: "sistema" },
    ],
  },
];

const categories: ContainerCategory[] = ["Produccion", "Bots", "Utilidades"];

function getStatusTone(status: ContainerStatus) {
  if (status === "Activo") {
    return "border-emerald-400/15 bg-emerald-400/10 text-emerald-100";
  }

  if (status === "Mantenimiento") {
    return "border-amber-400/15 bg-amber-400/10 text-amber-100";
  }

  return "border-white/8 bg-[#141414] text-zinc-400";
}

function getLogTone(type: ContainerLog["type"]) {
  if (type === "accion") {
    return "bg-sky-400/70";
  }

  if (type === "alerta") {
    return "bg-amber-400/80";
  }

  return "bg-zinc-500";
}

function renderVisualIcon(icon: ContainerVisualIcon) {
  const className = "h-5 w-5";

  if (icon === "bot") {
    return <Bot className={className} />;
  }

  if (icon === "shield") {
    return <ShieldCheck className={className} />;
  }

  if (icon === "database") {
    return <Database className={className} />;
  }

  if (icon === "globe") {
    return <Globe className={className} />;
  }

  if (icon === "wrench") {
    return <Wrench className={className} />;
  }

  return <TerminalSquare className={className} />;
}

function ActionPreviewModal({
  action,
  onClose,
}: {
  action: PreviewAction | null;
  onClose: () => void;
}) {
  if (!action) {
    return null;
  }

  const title =
    action.type === "search"
      ? "Buscar contenedor"
      : action.type === "new-container"
        ? "Nuevo contenedor"
        : "Cambiar imagen del contenedor";

  const description =
    action.type === "search"
      ? "Preview del filtro por nombre, categoria o host."
      : action.type === "new-container"
        ? "Preview del flujo futuro para levantar un contenedor nuevo en NEXO."
        : "Preview del selector visual para asignar una portada o imagen del servicio.";

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

        <div className="mt-5 rounded-2xl border border-white/8 bg-[#161616] p-4">
          {action.type === "search" ? (
            <div className="rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm text-zinc-500">
              Buscar por servicio, host, stack o estado...
            </div>
          ) : null}

          {action.type === "new-container" ? (
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm text-zinc-500">
                Nombre del contenedor
              </div>
              <div className="rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm text-zinc-500">
                Nodo destino
              </div>
              <div className="rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm text-zinc-500">
                Plantilla o stack
              </div>
              <div className="rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm text-zinc-500">
                Memoria / CPU
              </div>
            </div>
          ) : null}

          {action.type === "change-visual" ? (
            <div>
              <p className="text-sm font-medium text-zinc-100">{action.container.name}</p>
              <p className="mt-1 text-sm text-zinc-500">{action.container.service}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function VisualPicker({
  container,
  isOpen,
  onClose,
  onSelect,
}: {
  container: ContainerItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (visual: ContainerVisual) => void;
}) {
  if (!isOpen || !container) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 px-4 py-8 project-overlay">
      <div className="panel project-modal w-full max-w-2xl rounded-[22px] p-5 shadow-[0_24px_64px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-base font-medium text-zinc-100">Cambiar imagen</p>
            <p className="mt-1 text-sm text-zinc-400">
              Elige una identidad visual para {container.name}.
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

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visualOptions.map((visual) => (
            <button
              key={visual.id}
              type="button"
              onClick={() => onSelect(visual)}
              className="panel overflow-hidden rounded-[20px] p-0 text-left transition hover:border-white/14"
            >
              <div
                className={`relative h-28 bg-gradient-to-br ${visual.accent} before:absolute before:inset-0 before:content-['']`}
              >
                <div className="relative flex h-full items-center justify-between p-4 text-zinc-100">
                  <span>{renderVisualIcon(visual.icon)}</span>
                  <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] backdrop-blur-sm">
                    {visual.label}
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

export default function ContenedoresWorkspace() {
  const [previewAction, setPreviewAction] = useState<PreviewAction | null>(null);
  const [containers, setContainers] = useState(initialContainers);
  const [selectedHostId, setSelectedHostId] = useState(hostNodes[0]?.id ?? "");
  const [selectedContainerId, setSelectedContainerId] = useState(initialContainers[0]?.id ?? "");
  const [isVisualPickerOpen, setIsVisualPickerOpen] = useState(false);

  const selectedHost = hostNodes.find((host) => host.id === selectedHostId) ?? hostNodes[0] ?? null;

  const hostContainers = useMemo(
    () => containers.filter((container) => container.hostId === selectedHostId),
    [containers, selectedHostId],
  );

  const selectedContainer =
    hostContainers.find((container) => container.id === selectedContainerId) ??
    hostContainers[0] ??
    null;

  const counts = useMemo(
    () => ({
      total: containers.length,
      active: containers.filter((container) => container.status === "Activo").length,
      hosts: hostNodes.length,
      bots: containers.filter((container) => container.category === "Bots").length,
    }),
    [containers],
  );

  const applyContainerAction = (containerId: string, action: ContainerAction) => {
    const timestamp = "Hace unos segundos";

    setContainers((current) =>
      current.map((container) => {
        if (container.id !== containerId) {
          return container;
        }

        const nextStatus =
          action === "Iniciar" ? "Activo" : action === "Detener" ? "Detenido" : "Activo";

        const nextLog: ContainerLog = {
          id: `c-log-${Date.now()}-${containerId}`,
          message: `${action} solicitado desde NEXO`,
          time: timestamp,
          type: "accion",
        };

        return {
          ...container,
          status: nextStatus,
          uptime: action === "Detener" ? "0h" : action === "Iniciar" ? "0h 03m" : container.uptime,
          cpuLoad: action === "Detener" ? 0 : container.cpuLoad,
          ramLoad: action === "Detener" ? 0 : container.ramLoad,
          lastEvent: `${action} ejecutado desde el panel`,
          recentActions: [`${action} desde NEXO`, ...container.recentActions].slice(0, 4),
          logs: [nextLog, ...container.logs].slice(0, 6),
        };
      }),
    );
  };

  return (
    <>
      <div className="space-y-6">
        <section className="panel rounded-[18px] p-4">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">
                Contenedores
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-zinc-100">
                Servicios ligeros y procesos aislados
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                Vista para bots, proxies, workers y utilidades que viven aparte del nodo
                principal y se administran por contenedor.
              </p>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between rounded-xl border border-white/8 bg-[#161616] px-3 py-2.5 text-sm">
                <span className="text-zinc-400">Contenedores</span>
                <span className="font-mono text-zinc-100">{counts.total}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/8 bg-[#161616] px-3 py-2.5 text-sm">
                <span className="text-zinc-400">Activos</span>
                <span className="font-mono text-zinc-100">{counts.active}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/8 bg-[#161616] px-3 py-2.5 text-sm">
                <span className="text-zinc-400">Nodos</span>
                <span className="font-mono text-zinc-100">{counts.hosts}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/8 bg-[#161616] px-3 py-2.5 text-sm">
                <span className="text-zinc-400">Bots</span>
                <span className="font-mono text-zinc-100">{counts.bots}</span>
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
            <button
              type="button"
              onClick={() => setPreviewAction({ type: "new-container" })}
              className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#161616] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#1d1d1d]"
            >
              <Plus className="h-4 w-4" />
              Nuevo contenedor
            </button>
          </div>

          <div className="mt-6 grid gap-3 xl:grid-cols-3">
            {hostNodes.map((host) => {
              const hostCount = containers.filter((container) => container.hostId === host.id).length;
              const hostActive = containers.filter(
                (container) => container.hostId === host.id && container.status === "Activo",
              ).length;

              return (
                <button
                  key={host.id}
                  type="button"
                  onClick={() => {
                    setSelectedHostId(host.id);
                    const nextVisible = containers.filter((container) => container.hostId === host.id);
                    setSelectedContainerId((current) =>
                      nextVisible.some((container) => container.id === current)
                        ? current
                        : (nextVisible[0]?.id ?? ""),
                    );
                  }}
                  className={`rounded-[18px] border p-4 text-left transition ${
                    selectedHostId === host.id
                      ? "border-white/14 bg-[#1d1d1d]"
                      : "border-white/8 bg-[#161616] hover:border-white/14 hover:bg-[#1b1b1b]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-medium text-zinc-100">{host.name}</p>
                      <p className="mt-1 text-sm text-zinc-500">{host.role}</p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs ${
                        host.status === "Operativo"
                          ? "border-emerald-400/15 bg-emerald-400/10 text-emerald-100"
                          : "border-white/8 bg-[#141414] text-zinc-400"
                      }`}
                    >
                      {host.status}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm">
                      <p className="text-zinc-500">Zona</p>
                      <p className="mt-1 font-mono text-zinc-100">{host.zone}</p>
                    </div>
                    <div className="rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm">
                      <p className="text-zinc-500">IP</p>
                      <p className="mt-1 font-mono text-zinc-100">{host.ip}</p>
                    </div>
                    <div className="rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm">
                      <p className="text-zinc-500">Contenedores</p>
                      <p className="mt-1 font-mono text-zinc-100">{hostCount}</p>
                    </div>
                    <div className="rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm">
                      <p className="text-zinc-500">Activos</p>
                      <p className="mt-1 font-mono text-zinc-100">{hostActive}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="panel rounded-[18px] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-base font-medium text-zinc-100">
                {selectedHost?.name ?? "Nodo actual"}
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                {selectedHost?.role ?? "Servicios del nodo"}
              </p>
            </div>

            <div className="rounded-xl border border-white/8 bg-[#161616] px-3 py-2.5 text-sm">
              <span className="text-zinc-500">Visibles</span>
              <span className="ml-3 font-mono text-zinc-100">{hostContainers.length}</span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {categories.map((category) => {
              const categoryItems = hostContainers.filter((container) => container.category === category);

              return (
                <div key={category} className="rounded-[18px] border border-white/8 bg-[#141414] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-[#101010] px-3 py-1.5 text-sm text-zinc-200">
                      <Boxes className="h-4 w-4 text-zinc-500" />
                      {category}
                    </div>
                    <span className="text-xs font-mono text-zinc-500">{categoryItems.length}</span>
                  </div>

                  <div className="mt-4 grid gap-3 xl:grid-cols-2 2xl:grid-cols-3">
                    {categoryItems.length > 0 ? (
                      categoryItems.map((container) => (
                        <button
                          key={container.id}
                          type="button"
                          onClick={() => setSelectedContainerId(container.id)}
                          className={`rounded-[18px] border p-4 text-left transition ${
                            selectedContainer?.id === container.id
                              ? "border-white/14 bg-[#1d1d1d]"
                              : "border-white/8 bg-[#161616] hover:border-white/14 hover:bg-[#1b1b1b]"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br ${container.visual.accent} before:absolute before:inset-0 before:content-['']`}
                            >
                              <div className="relative grid h-full place-items-center text-zinc-100">
                                {renderVisualIcon(container.visual.icon)}
                              </div>
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="truncate text-base font-medium text-zinc-100">
                                  {container.name}
                                </p>
                                <span
                                  className={`rounded-full border px-3 py-1 text-xs ${getStatusTone(container.status)}`}
                                >
                                  {container.status}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-zinc-500">{container.service}</p>
                              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-zinc-600">
                                {container.lastEvent}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-2 sm:grid-cols-3">
                            <div className="rounded-xl border border-white/8 bg-[#101010] px-3 py-2 text-sm">
                              <p className="text-zinc-500">CPU</p>
                              <p className="mt-1 font-mono text-zinc-100">{container.cpuLoad}%</p>
                            </div>
                            <div className="rounded-xl border border-white/8 bg-[#101010] px-3 py-2 text-sm">
                              <p className="text-zinc-500">RAM</p>
                              <p className="mt-1 font-mono text-zinc-100">{container.ramLoad}%</p>
                            </div>
                            <div className="rounded-xl border border-white/8 bg-[#101010] px-3 py-2 text-sm">
                              <p className="text-zinc-500">Disco</p>
                              <p className="mt-1 font-mono text-zinc-100">{container.diskLoad}%</p>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                applyContainerAction(container.id, "Iniciar");
                              }}
                              className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#101010] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#151515] hover:text-zinc-100"
                            >
                              <Play className="h-4 w-4" />
                              Iniciar
                            </button>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                applyContainerAction(container.id, "Detener");
                              }}
                              className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#101010] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#151515] hover:text-zinc-100"
                            >
                              <Square className="h-4 w-4" />
                              Detener
                            </button>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                applyContainerAction(container.id, "Reiniciar");
                              }}
                              className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#101010] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#151515] hover:text-zinc-100"
                            >
                              <RotateCcw className="h-4 w-4" />
                              Reiniciar
                            </button>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="rounded-[18px] border border-dashed border-white/10 bg-[#101010] px-4 py-8 text-center text-sm text-zinc-500">
                        No hay contenedores visibles en esta categoria para este nodo.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {selectedContainer ? (
          <section className="panel rounded-[18px] p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-[22px] border border-white/8 bg-gradient-to-br ${selectedContainer.visual.accent} before:absolute before:inset-0 before:content-['']`}
                >
                  <div className="relative grid h-full place-items-center text-zinc-100">
                    {renderVisualIcon(selectedContainer.visual.icon)}
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold text-zinc-100">{selectedContainer.name}</h3>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs ${getStatusTone(selectedContainer.status)}`}
                    >
                      {selectedContainer.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-400">{selectedContainer.service}</p>
                  <p className="mt-2 text-sm text-zinc-500">{selectedContainer.lastEvent}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsVisualPickerOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#161616] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#1d1d1d]"
              >
                Cambiar imagen
              </button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-white/8 bg-[#161616] px-3 py-3 text-sm">
                <p className="text-zinc-500">CPU actual</p>
                <p className="mt-1 font-mono text-zinc-100">{selectedContainer.cpuLoad}%</p>
              </div>
              <div className="rounded-xl border border-white/8 bg-[#161616] px-3 py-3 text-sm">
                <p className="text-zinc-500">RAM actual</p>
                <p className="mt-1 font-mono text-zinc-100">{selectedContainer.ramLoad}%</p>
              </div>
              <div className="rounded-xl border border-white/8 bg-[#161616] px-3 py-3 text-sm">
                <p className="text-zinc-500">Disco</p>
                <p className="mt-1 font-mono text-zinc-100">{selectedContainer.diskLoad}%</p>
              </div>
              <div className="rounded-xl border border-white/8 bg-[#161616] px-3 py-3 text-sm">
                <p className="text-zinc-500">Uptime</p>
                <p className="mt-1 font-mono text-zinc-100">{selectedContainer.uptime}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-5">
                <div className="rounded-[18px] border border-white/8 bg-[#161616] p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => applyContainerAction(selectedContainer.id, "Iniciar")}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#101010] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#151515] hover:text-zinc-100"
                    >
                      <Play className="h-4 w-4" />
                      Iniciar
                    </button>
                    <button
                      type="button"
                      onClick={() => applyContainerAction(selectedContainer.id, "Detener")}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#101010] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#151515] hover:text-zinc-100"
                    >
                      <Square className="h-4 w-4" />
                      Detener
                    </button>
                    <button
                      type="button"
                      onClick={() => applyContainerAction(selectedContainer.id, "Reiniciar")}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#101010] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#151515] hover:text-zinc-100"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reiniciar
                    </button>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-white/8 bg-[#101010] px-3 py-3 text-sm">
                      <p className="text-zinc-500">Puertos</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedContainer.ports.map((port) => (
                          <span
                            key={port}
                            className="rounded-full border border-white/8 bg-[#161616] px-2.5 py-1 text-xs text-zinc-300"
                          >
                            {port}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/8 bg-[#101010] px-3 py-3 text-sm sm:col-span-2">
                      <p className="text-zinc-500">Stack</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedContainer.stack.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-white/8 bg-[#161616] px-2.5 py-1 text-xs text-zinc-300"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[18px] border border-white/8 bg-[#161616] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-zinc-100">Logs del contenedor</p>
                    <span className="text-xs text-zinc-500">{selectedContainer.logs.length} eventos</span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {selectedContainer.logs.map((log) => (
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
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-[18px] border border-white/8 bg-[#161616] p-4">
                  <p className="text-sm font-medium text-zinc-100">Acciones recientes</p>
                  <div className="mt-4 space-y-2">
                    {selectedContainer.recentActions.map((action) => (
                      <div
                        key={action}
                        className="rounded-xl border border-white/8 bg-[#101010] px-3 py-3 text-sm text-zinc-300"
                      >
                        {action}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[18px] border border-white/8 bg-[#161616] p-4">
                  <p className="text-sm font-medium text-zinc-100">Lectura rapida</p>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl border border-white/8 bg-[#101010] px-3 py-3 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-zinc-500">CPU</span>
                        <span className="font-mono text-zinc-100">{selectedContainer.cpuLoad}%</span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#1b1b1b]">
                        <div
                          className="h-full rounded-full bg-zinc-200"
                          style={{ width: `${selectedContainer.cpuLoad}%` }}
                        />
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/8 bg-[#101010] px-3 py-3 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-zinc-500">RAM</span>
                        <span className="font-mono text-zinc-100">{selectedContainer.ramLoad}%</span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#1b1b1b]">
                        <div
                          className="h-full rounded-full bg-zinc-300"
                          style={{ width: `${selectedContainer.ramLoad}%` }}
                        />
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/8 bg-[#101010] px-3 py-3 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-zinc-500">Disco</span>
                        <span className="font-mono text-zinc-100">{selectedContainer.diskLoad}%</span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#1b1b1b]">
                        <div
                          className="h-full rounded-full bg-zinc-500"
                          style={{ width: `${selectedContainer.diskLoad}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>

      <VisualPicker
        container={selectedContainer}
        isOpen={isVisualPickerOpen}
        onClose={() => setIsVisualPickerOpen(false)}
        onSelect={(visual) => {
          if (!selectedContainer) {
            return;
          }

          setContainers((current) =>
            current.map((container) =>
              container.id === selectedContainer.id ? { ...container, visual } : container,
            ),
          );
          setIsVisualPickerOpen(false);
        }}
      />
      <ActionPreviewModal action={previewAction} onClose={() => setPreviewAction(null)} />
    </>
  );
}
