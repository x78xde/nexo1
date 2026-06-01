"use client";

import {
  CalendarDays,
  CheckCheck,
  ChevronDown,
  Ellipsis,
  ExternalLink,
  FileText,
  FolderKanban,
  GripVertical,
  ImagePlus,
  Link2,
  Plus,
  Save,
  Search,
  SquarePen,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type ProjectStatus =
  | "Idea"
  | "Planeado"
  | "En progreso"
  | "Pausado"
  | "Terminado"
  | "Archivado";

type TaskStatus = "Ideas" | "En progreso" | "En revision" | "Hecho";
type TaskPriority = "Baja" | "Media" | "Alta";

type ProjectTask = {
  id: string;
  label: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  tag: string;
};

type ProjectLink = {
  label: string;
  href: string;
};

type ProjectFile = {
  name: string;
  meta: string;
};

type ProjectItem = {
  id: string;
  name: string;
  status: ProjectStatus;
  description: string;
  updated: string;
  created: string;
  coverLabel: string;
  coverAccent: string;
  notes: string[];
  tasks: ProjectTask[];
  files: ProjectFile[];
  links: ProjectLink[];
};

type PreviewAction =
  | { type: "create" }
  | { type: "search" }
  | { type: "save"; project: ProjectItem }
  | { type: "cover"; project: ProjectItem }
  | { type: "details"; project: ProjectItem }
  | { type: "files"; project: ProjectItem }
  | { type: "links"; project: ProjectItem };

const taskColumns: { id: TaskStatus; label: string }[] = [
  { id: "Ideas", label: "Ideas" },
  { id: "En progreso", label: "En progreso" },
  { id: "En revision", label: "En revision" },
  { id: "Hecho", label: "Hecho" },
];

const emptyTaskDraft = {
  label: "",
  priority: "Media" as TaskPriority,
  dueDate: "",
  tag: "",
  status: "Ideas" as TaskStatus,
};

function DarkSelect({
  value,
  options,
  onChange,
  toneClassName,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  toneClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-sm outline-none transition hover:border-white/14 ${
          toneClassName ?? "border-white/8 bg-[#101010] text-zinc-100"
        }`}
      >
        <span>{value}</span>
        <ChevronDown className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 rounded-2xl border border-white/8 bg-[#161616] p-2 shadow-[0_12px_30px_rgba(0,0,0,0.34)]">
          <div className="space-y-1">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${
                  option === value
                    ? "bg-[#222222] text-zinc-100"
                    : "text-zinc-300 hover:bg-[#202020] hover:text-zinc-100"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

const initialProjects: ProjectItem[] = [
  {
    id: "minecraft",
    name: "Servidor Minecraft",
    status: "En progreso",
    description: "Configuracion principal del servidor, plugins, backups y acceso externo.",
    updated: "Hoy 18:40",
    created: "12 abril 2026",
    coverLabel: "Paper + plugins",
    coverAccent:
      "from-zinc-700 via-zinc-800 to-zinc-950 before:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_55%)]",
    notes: [
      "Probar Geyser antes de abrir acceso a invitados.",
      "Mantener backups diarios fuera de la carpeta principal.",
      "Revisar consumo de RAM con 8 usuarios concurrentes.",
    ],
    tasks: [
      { id: "t1", label: "Instalar Paper", status: "Hecho", priority: "Alta", dueDate: "02 mayo", tag: "Servidor" },
      { id: "t2", label: "Configurar backups", status: "Hecho", priority: "Alta", dueDate: "03 mayo", tag: "Seguridad" },
      { id: "t3", label: "Ajustar plugins base", status: "Ideas", priority: "Media", dueDate: "07 mayo", tag: "Plugins" },
      { id: "t4", label: "Probar acceso externo", status: "Ideas", priority: "Alta", dueDate: "09 mayo", tag: "Red" },
    ],
    files: [
      { name: "server.jar", meta: "Binario principal" },
      { name: "plugins.zip", meta: "Paquete de plugins" },
      { name: "notas-rendimiento.md", meta: "Checklist tecnico" },
    ],
    links: [
      { label: "Panel Proxmox", href: "https://proxmox.local:8006" },
      { label: "Guia PaperMC", href: "https://papermc.io" },
    ],
  },
  {
    id: "nexo-ui",
    name: "Rediseno NEXO",
    status: "Planeado",
    description: "Refinar la interfaz del panel, modulos base y lenguaje visual general.",
    updated: "Ayer 22:14",
    created: "28 abril 2026",
    coverLabel: "UI + estructura",
    coverAccent:
      "from-zinc-800 via-zinc-900 to-black before:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%)]",
    notes: [
      "Mantener sidebar compacta y fondo sobrio.",
      "Hacer modulos largos en componentes separados.",
      "Preparar vistas mock para backend futuro.",
    ],
    tasks: [
      { id: "t1", label: "Base del dashboard", status: "Hecho", priority: "Alta", dueDate: "29 abril", tag: "Inicio" },
      { id: "t2", label: "Rehacer gestor de archivos", status: "Hecho", priority: "Alta", dueDate: "30 abril", tag: "Archivos" },
      { id: "t3", label: "Disenar compartidos", status: "En revision", priority: "Media", dueDate: "03 mayo", tag: "Compartidos" },
      { id: "t4", label: "Disenar proyectos", status: "En progreso", priority: "Alta", dueDate: "04 mayo", tag: "Proyectos" },
    ],
    files: [
      { name: "layout-notes.md", meta: "Notas de interfaz" },
      { name: "nexo-wireframe.drawio", meta: "Esquema general" },
    ],
    links: [{ label: "Referencia TrueNAS", href: "https://www.truenas.com" }],
  },
  {
    id: "vault-docs",
    name: "Vault documental",
    status: "Pausado",
    description: "Clasificacion de PDFs, contratos, guias y recursos personales dentro de NEXO.",
    updated: "Hace 3 dias",
    created: "21 marzo 2026",
    coverLabel: "Documentos",
    coverAccent:
      "from-zinc-700 via-zinc-900 to-zinc-950 before:bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_55%)]",
    notes: [
      "Separar archivos privados de compartidos publicos.",
      "Definir etiquetas por tipo de documento.",
    ],
    tasks: [
      { id: "t1", label: "Crear estructura principal", status: "Hecho", priority: "Media", dueDate: "15 abril", tag: "Base" },
      { id: "t2", label: "Mover PDFs tecnicos", status: "En progreso", priority: "Alta", dueDate: "08 mayo", tag: "Migracion" },
      { id: "t3", label: "Crear convencion de nombres", status: "Ideas", priority: "Media", dueDate: "10 mayo", tag: "Orden" },
    ],
    files: [
      { name: "estructura-documentos.txt", meta: "Base de carpetas" },
      { name: "manual-proxmox.pdf", meta: "Guia tecnica" },
    ],
    links: [{ label: "Repositorio de notas", href: "https://example.local/docs" }],
  },
];

function getStatusTone(status: ProjectStatus) {
  if (status === "En progreso") {
    return "border-sky-400/15 bg-sky-400/10 text-sky-100";
  }

  if (status === "Planeado") {
    return "border-zinc-300/10 bg-zinc-300/10 text-zinc-200";
  }

  if (status === "Pausado") {
    return "border-amber-400/15 bg-amber-400/10 text-amber-100";
  }

  if (status === "Terminado") {
    return "border-emerald-400/15 bg-emerald-400/10 text-emerald-100";
  }

  if (status === "Archivado") {
    return "border-white/8 bg-[#161616] text-zinc-400";
  }

  return "border-violet-400/15 bg-violet-400/10 text-violet-100";
}

function getTaskStatusTone(status: TaskStatus) {
  if (status === "En progreso") {
    return "border-sky-400/15 bg-sky-400/10 text-sky-100";
  }

  if (status === "En revision") {
    return "border-amber-400/15 bg-amber-400/10 text-amber-100";
  }

  if (status === "Hecho") {
    return "border-emerald-400/15 bg-emerald-400/10 text-emerald-100";
  }

  return "border-zinc-300/10 bg-zinc-300/10 text-zinc-200";
}

function getTaskColumnTone(status: TaskStatus) {
  if (status === "En progreso") {
    return "bg-sky-400/[0.045]";
  }

  if (status === "En revision") {
    return "bg-amber-400/[0.045]";
  }

  if (status === "Hecho") {
    return "bg-emerald-400/[0.04]";
  }

  return "bg-zinc-400/[0.03]";
}

function getPriorityTone(priority: TaskPriority) {
  if (priority === "Alta") {
    return "border-rose-400/15 bg-rose-400/10 text-rose-100";
  }

  if (priority === "Media") {
    return "border-amber-400/15 bg-amber-400/10 text-amber-100";
  }

  return "border-zinc-300/10 bg-zinc-300/10 text-zinc-200";
}

function ProjectPreview({
  action,
  onClose,
}: {
  action: PreviewAction | null;
  onClose: () => void;
}) {
  if (!action) {
    return null;
  }

  const project = "project" in action ? action.project : null;

  const header =
    action.type === "create"
      ? {
          icon: Plus,
          title: "Nuevo proyecto",
          description: "Preview del formulario para crear un proyecto con estado, portada y notas base.",
        }
      : action.type === "search"
        ? {
            icon: Search,
            title: "Buscar proyecto",
            description: "Preview del filtro por nombre, estado, tarea o archivo relacionado.",
          }
        : action.type === "save"
          ? {
              icon: Save,
              title: "Guardar cambios",
              description: "Preview del guardado del proyecto con tareas, notas y cambios visuales.",
            }
        : action.type === "cover"
          ? {
              icon: ImagePlus,
              title: "Cambiar portada",
              description: "Preview del flujo para asignar una imagen principal al proyecto.",
            }
          : action.type === "files"
            ? {
                icon: FileText,
                title: "Gestionar archivos",
                description: "Preview del panel para adjuntar o reorganizar archivos del proyecto.",
              }
            : action.type === "links"
              ? {
                  icon: Link2,
                  title: "Gestionar links",
                  description: "Preview para agregar o editar enlaces utiles dentro del proyecto.",
                }
              : {
                  icon: SquarePen,
                  title: "Vista completa",
                  description: "Preview del editor completo con portada, notas, tareas y relaciones.",
                };

  const Icon = header.icon;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 px-4 py-8 project-overlay">
      <div className="panel project-modal w-full max-w-2xl rounded-[22px] p-5 shadow-[0_24px_64px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/8 bg-[#161616] text-zinc-200">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-medium text-zinc-100">{header.title}</p>
              <p className="mt-1 text-sm text-zinc-400">{header.description}</p>
            </div>
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
          {action.type === "create" ? (
            <>
              <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Campos base</p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl bg-[#101010] px-3 py-2.5 text-sm text-zinc-300">
                    Nombre del proyecto
                  </div>
                  <div className="rounded-xl bg-[#101010] px-3 py-2.5 text-sm text-zinc-300">
                    Estado inicial
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Portada</p>
                <div className="mt-3 rounded-2xl border border-dashed border-white/8 bg-[#101010] px-4 py-8 text-center text-sm text-zinc-500">
                  Zona para subir o elegir imagen del proyecto
                </div>
              </div>
            </>
          ) : null}

          {action.type === "search" ? (
            <>
              <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Busqueda</p>
                <div className="mt-3 rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm text-zinc-500">
                  Buscar por nombre, estado, tarea o archivo relacionado...
                </div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Filtros simulados</p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full bg-[#101010] px-3 py-1.5 text-zinc-300">En progreso</span>
                  <span className="rounded-full bg-[#101010] px-3 py-1.5 text-zinc-300">Pausados</span>
                  <span className="rounded-full bg-[#101010] px-3 py-1.5 text-zinc-300">Con portada</span>
                </div>
              </div>
            </>
          ) : null}

          {project ? (
            <>
              <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Proyecto</p>
                <p className="mt-2 text-sm font-medium text-zinc-100">{project.name}</p>
                <p className="mt-1 text-sm text-zinc-500">{project.description}</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Estado</p>
                  <p className="mt-2 text-sm text-zinc-100">{project.status}</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Actividad</p>
                  <p className="mt-2 text-sm text-zinc-100">{project.updated}</p>
                </div>
              </div>

              {action.type === "save" ? (
                <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Estado del guardado</p>
                  <p className="mt-2 text-sm text-zinc-300">
                    Aqui despues podras confirmar los cambios del proyecto y sincronizarlos con backend.
                  </p>
                </div>
              ) : null}
            </>
          ) : null}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/8 bg-[#161616] px-4 py-2 text-sm text-zinc-300 transition hover:bg-[#1d1d1d] hover:text-zinc-100"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function TaskComposer({
  isOpen,
  draft,
  onChange,
  onClose,
  onCreate,
}: {
  isOpen: boolean;
  draft: {
    label: string;
    priority: TaskPriority;
    dueDate: string;
    tag: string;
    status: TaskStatus;
  };
  onChange: (field: "label" | "priority" | "dueDate" | "tag" | "status", value: string) => void;
  onClose: () => void;
  onCreate: () => void;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 px-4 py-8 project-overlay">
      <div className="panel project-modal w-full max-w-xl rounded-[22px] p-5 shadow-[0_24px_64px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/8 bg-[#161616] text-zinc-200">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-medium text-zinc-100">Nueva tarea</p>
              <p className="mt-1 text-sm text-zinc-400">
                Define titulo, estado, prioridad, etiqueta y fecha para el tablero.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/8 bg-[#161616] text-zinc-400 transition hover:text-zinc-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">Titulo</span>
            <input
              value={draft.label}
              onChange={(event) => onChange("label", event.target.value)}
              className="w-full rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-white/14"
              placeholder="Nueva tarea"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">Estado inicial</span>
              <DarkSelect
                value={draft.status}
                onChange={(value) => onChange("status", value)}
                options={taskColumns.map((column) => column.id)}
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">Prioridad</span>
              <DarkSelect
                value={draft.priority}
                onChange={(value) => onChange("priority", value)}
                options={["Baja", "Media", "Alta"]}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">Etiqueta</span>
              <input
                value={draft.tag}
                onChange={(event) => onChange("tag", event.target.value)}
                className="w-full rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-white/14"
                placeholder="Ej. Plugins"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">Fecha</span>
              <input
                type="date"
                value={draft.dueDate}
                onChange={(event) => onChange("dueDate", event.target.value)}
                className="w-full rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-white/14"
              />
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/8 bg-[#161616] px-4 py-2 text-sm text-zinc-300 transition hover:bg-[#1d1d1d] hover:text-zinc-100"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onCreate}
            className="rounded-xl border border-white/8 bg-[#101010] px-4 py-2 text-sm text-zinc-100 transition hover:bg-[#151515]"
          >
            Crear tarea
          </button>
        </div>
      </div>
    </div>
  );
}

function TaskEditor({
  task,
  isOpen,
  onClose,
  onChange,
  onDelete,
}: {
  task: ProjectTask | null;
  isOpen: boolean;
  onClose: () => void;
  onChange: (field: "label" | "priority" | "dueDate" | "tag" | "status", value: string) => void;
  onDelete: () => void;
}) {
  if (!isOpen || !task) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 px-4 py-8 project-overlay">
      <div className="panel project-modal w-full max-w-sm rounded-[22px] p-4 shadow-[0_24px_64px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-base font-medium text-zinc-100">Editar tarea</p>
            <p className="mt-1 text-sm text-zinc-400">
              Cambia estado, prioridad, etiqueta, fecha o elimina la tarea.
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

        <div className="mt-4 space-y-3">
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">Titulo</span>
            <input
              value={task.label}
              onChange={(event) => onChange("label", event.target.value)}
              className="w-full rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-white/14"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">Estado</span>
            <DarkSelect
              value={task.status}
              onChange={(value) => onChange("status", value)}
              options={taskColumns.map((column) => column.id)}
              toneClassName={getTaskStatusTone(task.status)}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">Prioridad</span>
            <DarkSelect
              value={task.priority}
              onChange={(value) => onChange("priority", value)}
              options={["Baja", "Media", "Alta"]}
              toneClassName={getPriorityTone(task.priority)}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">Etiqueta</span>
            <input
              value={task.tag}
              onChange={(event) => onChange("tag", event.target.value)}
              className="w-full rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-white/14"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">Fecha</span>
            <input
              type="date"
              value={task.dueDate === "Sin fecha" ? "" : task.dueDate}
              onChange={(event) => onChange("dueDate", event.target.value || "Sin fecha")}
              className="w-full rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-white/14"
            />
          </label>
        </div>

        <div className="mt-5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#2a1517] px-3 py-2 text-sm text-zinc-100 transition hover:bg-[#351b1d]"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/8 bg-[#161616] px-4 py-2 text-sm text-zinc-300 transition hover:bg-[#1d1d1d] hover:text-zinc-100"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectMenu({
  project,
  onAction,
}: {
  project: ProjectItem;
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

  const menuItems = [
    { label: "Abrir editor", action: () => onAction({ type: "details", project }) },
    { label: "Cambiar portada", action: () => onAction({ type: "cover", project }) },
    { label: "Archivos", action: () => onAction({ type: "files", project }) },
    { label: "Links", action: () => onAction({ type: "links", project }) },
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
            {menuItems.map((menuItem) => (
              <button
                key={menuItem.label}
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  menuItem.action();
                }}
                className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-zinc-300 transition hover:bg-[#222222] hover:text-zinc-100"
              >
                {menuItem.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function ProyectosWorkspace() {
  const [previewAction, setPreviewAction] = useState<PreviewAction | null>(null);
  const [projects, setProjects] = useState(initialProjects);
  const [selectedId, setSelectedId] = useState(initialProjects[0]?.id ?? "");
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null);
  const [lastMovedTaskId, setLastMovedTaskId] = useState<string | null>(null);
  const [isTaskComposerOpen, setIsTaskComposerOpen] = useState(false);
  const [taskDraft, setTaskDraft] = useState(emptyTaskDraft);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const detailSectionRef = useRef<HTMLElement | null>(null);

  const selectedProject = selectedId
    ? projects.find((project) => project.id === selectedId) ?? null
    : null;
  const editingTask =
    selectedProject?.tasks.find((task) => task.id === editingTaskId) ?? null;

  const updateProject = (projectId: string, updater: (project: ProjectItem) => ProjectItem) => {
    setProjects((current) =>
      current.map((project) => (project.id === projectId ? updater(project) : project)),
    );
  };

  const progress = useMemo(() => {
    if (!selectedProject) {
      return { total: 0, completed: 0, ratio: 0 };
    }

    const total = selectedProject.tasks.length;
    const completed = selectedProject.tasks.filter((task) => task.status === "Hecho").length;

    return {
      total,
      completed,
      ratio: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [selectedProject]);

  const createTask = (projectId: string) => {
    if (!taskDraft.label.trim()) {
      return;
    }

    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: [
                ...project.tasks,
                {
                  id: `task-${Date.now()}`,
                  label: taskDraft.label.trim(),
                  status: taskDraft.status,
                  priority: taskDraft.priority,
                  dueDate: taskDraft.dueDate || "Sin fecha",
                  tag: taskDraft.tag.trim() || "General",
                },
              ],
            }
          : project,
      ),
    );

    setTaskDraft(emptyTaskDraft);
    setIsTaskComposerOpen(false);
  };

  const addNote = (projectId: string) => {
    updateProject(projectId, (project) => ({
      ...project,
      notes: [...project.notes, "Nueva nota"],
    }));
  };

  const deleteNote = (projectId: string, noteIndex: number) => {
    updateProject(projectId, (project) => ({
      ...project,
      notes: project.notes.filter((_, currentIndex) => currentIndex !== noteIndex),
    }));
  };

  const moveTaskToStatus = (projectId: string, taskId: string, status: TaskStatus) => {
    updateProject(projectId, (project) => ({
      ...project,
      tasks: project.tasks.map((task) =>
        task.id === taskId ? { ...task, status } : task,
      ),
    }));
    setLastMovedTaskId(taskId);
  };

  useEffect(() => {
    if (!lastMovedTaskId) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setLastMovedTaskId(null);
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [lastMovedTaskId]);

  const selectProject = (projectId: string) => {
    setSelectedId(projectId);

    requestAnimationFrame(() => {
      window.setTimeout(() => {
        detailSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 60);
    });
  };

  return (
    <>
      <div className="space-y-6">
        <section className="panel rounded-[18px] p-4">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">Proyectos</p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-100">Panel de proyectos</h2>
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
              onClick={() => setPreviewAction({ type: "create" })}
              className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#202020] px-3 py-2 text-sm font-medium text-zinc-100 transition hover:bg-[#262626]"
            >
              <Plus className="h-4 w-4" />
              Nuevo proyecto
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => {
              const completed = project.tasks.filter((task) => task.status === "Hecho").length;
              const total = project.tasks.length;
              const ratio = total > 0 ? Math.round((completed / total) * 100) : 0;

              return (
                <article
                  key={project.id}
                  onClick={() => selectProject(project.id)}
                  style={{ animationDelay: `${projects.findIndex((item) => item.id === project.id) * 70}ms` }}
                  className={`panel project-card project-card-enter cursor-pointer overflow-hidden rounded-[22px] p-0 transition hover:border-white/14 hover:bg-[#1d1d1d] ${
                    selectedProject?.id === project.id ? "border-white/14 bg-[#1d1d1d]" : ""
                  }`}
                >
                  <div
                    className={`relative h-32 bg-gradient-to-br ${project.coverAccent} before:absolute before:inset-0 before:content-['']`}
                  >
                    <div className="relative flex h-full items-start justify-between p-4">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-black/20 text-zinc-100 backdrop-blur-sm">
                        <FolderKanban className="h-5 w-5" />
                      </div>
                      <ProjectMenu project={project} onAction={setPreviewAction} />
                    </div>

                    <div className="absolute inset-x-4 bottom-4">
                      <div className="inline-flex rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-zinc-200 backdrop-blur-sm">
                        {project.coverLabel}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-zinc-100">{project.name}</h3>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs ${getStatusTone(project.status)}`}
                      >
                        {project.status}
                      </span>
                    </div>

                    <p className="text-sm leading-6 text-zinc-400">{project.description}</p>

                    <div className="space-y-2 rounded-2xl border border-white/8 bg-[#161616] p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-400">Tareas</span>
                        <span className="font-mono text-zinc-100">
                          {completed}/{total}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-[#101010]">
                        <div
                          className="h-2 rounded-full bg-zinc-300 transition-all"
                          style={{ width: `${ratio}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {selectedProject ? (
          <section
            key={selectedProject.id}
            ref={detailSectionRef}
            className="panel project-workspace-enter relative rounded-[18px] p-4"
          >
            <button
              type="button"
              onClick={() => setSelectedId("")}
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-xl border border-white/8 bg-[#161616] text-zinc-400 transition hover:bg-[#1d1d1d] hover:text-zinc-100"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4 flex flex-wrap items-center gap-2 pr-12">
              <button
                type="button"
                onClick={() => setPreviewAction({ type: "save", project: selectedProject })}
                className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#101010] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#151515] hover:text-zinc-100"
              >
                <Save className="h-4 w-4" />
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setIsTaskComposerOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#101010] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#151515] hover:text-zinc-100"
              >
                <Plus className="h-4 w-4" />
                Anadir tarea
              </button>
              <button
                type="button"
                onClick={() => setPreviewAction({ type: "cover", project: selectedProject })}
                className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#101010] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#151515] hover:text-zinc-100"
              >
                <ImagePlus className="h-4 w-4" />
                Cambiar portada
              </button>
              <button
                type="button"
                onClick={() => setPreviewAction({ type: "cover", project: selectedProject })}
                className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#101010] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#151515] hover:text-zinc-100"
              >
                <ImagePlus className="h-4 w-4" />
                Cambiar portada
              </button>
            </div>

            <div className="overflow-hidden rounded-[22px] border border-white/8 bg-[#161616]">
              <div className={`relative h-52 bg-gradient-to-br ${selectedProject.coverAccent}`}>
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative flex h-full items-end justify-between gap-4 p-5">
                  <div>
                    <div className="inline-flex rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-zinc-100 backdrop-blur-sm">
                      {selectedProject.coverLabel}
                    </div>
                    <h3 className="mt-3 text-2xl font-semibold text-zinc-100">
                      {selectedProject.name}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">
                      {selectedProject.description}
                    </p>
                  </div>

                </div>
              </div>

              <div className="grid gap-3 border-t border-white/8 p-4 md:grid-cols-4">
                <div className="rounded-xl border border-white/8 bg-[#101010] px-3 py-3 text-sm">
                  <p className="text-zinc-500">Estado</p>
                  <p className="mt-1 text-zinc-100">{selectedProject.status}</p>
                </div>
                <div className="rounded-xl border border-white/8 bg-[#101010] px-3 py-3 text-sm">
                  <p className="text-zinc-500">Tareas</p>
                  <p className="mt-1 font-mono text-zinc-100">
                    {progress.completed}/{progress.total}
                  </p>
                </div>
                <div className="rounded-xl border border-white/8 bg-[#101010] px-3 py-3 text-sm">
                  <p className="text-zinc-500">Creado</p>
                  <p className="mt-1 font-mono text-zinc-100">{selectedProject.created}</p>
                </div>
                <div className="rounded-xl border border-white/8 bg-[#101010] px-3 py-3 text-sm">
                  <p className="text-zinc-500">Actualizado</p>
                  <p className="mt-1 font-mono text-zinc-100">{selectedProject.updated}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-5">
              <section className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-100">Tareas del proyecto</p>
                    <p className="mt-1 text-sm text-zinc-500">Flujo visual por estado dentro del proyecto</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="shrink-0 whitespace-nowrap rounded-xl border border-white/8 bg-[#101010] px-3 py-2 text-sm text-zinc-300">
                      {progress.ratio}% completado
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsTaskComposerOpen(true)}
                      className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border border-white/8 bg-[#101010] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#151515] hover:text-zinc-100"
                    >
                      <Plus className="h-4 w-4" />
                      Nueva tarea
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {taskColumns.map((column) => {
                    const columnTasks = selectedProject.tasks.filter(
                      (task) => task.status === column.id,
                    );

                    return (
                      <div
                        key={column.id}
                        onDragOver={(event) => {
                          event.preventDefault();
                          setDragOverStatus(column.id);
                        }}
                        onDragLeave={() => {
                          if (dragOverStatus === column.id) {
                            setDragOverStatus(null);
                          }
                        }}
                        onDrop={(event) => {
                          event.preventDefault();
                          if (draggingTaskId) {
                            moveTaskToStatus(selectedProject.id, draggingTaskId, column.id);
                          }
                          setDragOverStatus(null);
                          setDraggingTaskId(null);
                        }}
                        className={`min-h-[320px] rounded-2xl border p-3 transition ${getTaskColumnTone(column.id)} ${
                          dragOverStatus === column.id
                            ? "border-white/18 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]"
                            : "border-white/8"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs ${getTaskStatusTone(column.id)}`}
                          >
                            {column.label}
                          </span>
                          <span className="text-xs font-mono text-zinc-500">
                            {columnTasks.length}
                          </span>
                        </div>

                        <div className="mt-3 space-y-3">
                          {columnTasks.length > 0 ? (
                            columnTasks.map((task) => (
                                <div
                                  key={task.id}
                                  draggable
                                  onDragStart={() => setDraggingTaskId(task.id)}
                                  onDragEnd={() => {
                                  setDraggingTaskId(null);
                                  setDragOverStatus(null);
                                }}
                                className={`cursor-grab rounded-xl border border-white/8 bg-[#161616] p-3 active:cursor-grabbing ${
                                  draggingTaskId === task.id ? "opacity-60" : ""
                                  } ${
                                    lastMovedTaskId === task.id ? "project-task-drop" : ""
                                  }`}
                                >
                                  <div className="flex items-start gap-2">
                                    <div className="mt-0.5 inline-flex items-center gap-1.5 rounded-lg border border-white/8 bg-[#101010] px-2 py-1 text-zinc-400">
                                      <GripVertical className="h-3.5 w-3.5" />
                                    </div>
                                    <input
                                      value={task.label}
                                      readOnly
                                      className="w-full bg-transparent text-sm text-zinc-100 outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setEditingTaskId(task.id)}
                                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/8 bg-[#101010] text-zinc-500 transition hover:border-white/14 hover:text-zinc-100"
                                    >
                                      <Ellipsis className="h-4 w-4" />
                                    </button>
                                  </div>

                                  <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <span
                                      className={`rounded-full border px-2.5 py-1 text-xs ${getTaskStatusTone(task.status)}`}
                                    >
                                      {task.status}
                                    </span>
                                    <span
                                      className={`rounded-full border px-2.5 py-1 text-xs ${getPriorityTone(task.priority)}`}
                                    >
                                      {task.priority}
                                    </span>
                                    <span className="rounded-full border border-white/8 bg-[#101010] px-2.5 py-1 text-xs text-zinc-300">
                                      {task.tag}
                                    </span>
                                  </div>

                                  <div className="mt-3 flex items-center justify-between gap-2 text-xs text-zinc-500">
                                    <div className="inline-flex items-center gap-1.5">
                                      <CalendarDays className="h-3.5 w-3.5" />
                                      <span>{task.dueDate}</span>
                                    </div>

                                    {task.status === "Hecho" ? (
                                      <div className="grid h-8 w-8 place-items-center rounded-lg border border-emerald-400/15 bg-emerald-400/10 text-emerald-100">
                                        <CheckCheck className="h-4 w-4" />
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              ))
                          ) : (
                            <div className="rounded-xl border border-dashed border-white/10 px-3 py-6 text-center text-sm text-zinc-500">
                              Sin tareas en esta columna
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
                <div className="space-y-5">
                  <section className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-zinc-100">Datos del proyecto</p>
                        <p className="mt-1 text-sm text-zinc-500">
                          Edicion visual local del contenido principal
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreviewAction({ type: "details", project: selectedProject })}
                        className="rounded-xl border border-white/8 bg-[#101010] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#151515] hover:text-zinc-100"
                      >
                        Preview
                      </button>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <label className="space-y-2">
                        <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">Nombre</span>
                        <input
                          value={selectedProject.name}
                          onChange={(event) =>
                            updateProject(selectedProject.id, (project) => ({
                              ...project,
                              name: event.target.value,
                            }))
                          }
                          className="w-full rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-white/14"
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">Estado</span>
                        <select
                          value={selectedProject.status}
                          onChange={(event) =>
                            updateProject(selectedProject.id, (project) => ({
                              ...project,
                              status: event.target.value as ProjectStatus,
                            }))
                          }
                          className="w-full rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-white/14"
                        >
                          <option>Idea</option>
                          <option>Planeado</option>
                          <option>En progreso</option>
                          <option>Pausado</option>
                          <option>Terminado</option>
                          <option>Archivado</option>
                        </select>
                      </label>
                    </div>

                    <label className="mt-4 block space-y-2">
                      <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">Descripcion</span>
                      <textarea
                        value={selectedProject.description}
                        onChange={(event) =>
                          updateProject(selectedProject.id, (project) => ({
                            ...project,
                            description: event.target.value,
                          }))
                        }
                        rows={4}
                        className="w-full rounded-2xl border border-white/8 bg-[#101010] px-3 py-3 text-sm leading-6 text-zinc-100 outline-none transition focus:border-white/14"
                      />
                    </label>
                  </section>
                </div>

                <div className="space-y-5">
                <section className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-zinc-100">Notas</p>
                    <button
                      type="button"
                      onClick={() => addNote(selectedProject.id)}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#101010] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#151515] hover:text-zinc-100"
                    >
                      <Plus className="h-4 w-4" />
                      Nueva nota
                    </button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {selectedProject.notes.length > 0 ? (
                      selectedProject.notes.map((note, index) => (
                        <div
                          key={`${selectedProject.id}-note-${index}`}
                          className="rounded-2xl border border-white/8 bg-[#101010] p-3"
                        >
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                              Nota {index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => deleteNote(selectedProject.id, index)}
                              className="grid h-8 w-8 place-items-center rounded-lg border border-white/8 bg-[#161616] text-zinc-500 transition hover:border-white/14 hover:text-zinc-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <textarea
                            value={note}
                            onChange={(event) =>
                              updateProject(selectedProject.id, (project) => ({
                                ...project,
                                notes: project.notes.map((currentNote, noteIndex) =>
                                  noteIndex === index ? event.target.value : currentNote,
                                ),
                              }))
                            }
                            rows={4}
                            className="w-full bg-transparent text-sm leading-6 text-zinc-300 outline-none"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-dashed border-white/10 px-3 py-6 text-center text-sm text-zinc-500">
                        Sin notas en este proyecto
                      </div>
                    )}
                  </div>
                </section>

                <section className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-zinc-100">Archivos relacionados</p>
                    <button
                      type="button"
                      onClick={() => setPreviewAction({ type: "files", project: selectedProject })}
                      className="rounded-xl border border-white/8 bg-[#101010] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#151515] hover:text-zinc-100"
                    >
                      Gestionar
                    </button>
                  </div>

                  <div className="mt-4 space-y-2">
                    {selectedProject.files.map((file) => (
                      <div
                        key={file.name}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-[#101010] px-3 py-3 text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/8 bg-[#161616] text-zinc-300">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-zinc-100">{file.name}</p>
                            <p className="mt-1 text-zinc-500">{file.meta}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreviewAction({ type: "files", project: selectedProject })}
                          className="text-zinc-500 transition hover:text-zinc-200"
                        >
                          <Ellipsis className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-zinc-100">Links utiles</p>
                    <button
                      type="button"
                      onClick={() => setPreviewAction({ type: "links", project: selectedProject })}
                      className="rounded-xl border border-white/8 bg-[#101010] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#151515] hover:text-zinc-100"
                    >
                      Gestionar
                    </button>
                  </div>

                  <div className="mt-4 space-y-2">
                    {selectedProject.links.map((link) => (
                      <div
                        key={link.label}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-[#101010] px-3 py-3 text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/8 bg-[#161616] text-zinc-300">
                            <Link2 className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-zinc-100">{link.label}</p>
                            <p className="mt-1 text-zinc-500">{link.href}</p>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-zinc-500" />
                      </div>
                    ))}
                  </div>
                </section>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>

      <TaskComposer
        isOpen={isTaskComposerOpen}
        draft={taskDraft}
        onChange={(field, value) =>
          setTaskDraft((current) => ({
            ...current,
            [field]: value,
          }))
        }
        onClose={() => {
          setIsTaskComposerOpen(false);
          setTaskDraft(emptyTaskDraft);
        }}
        onCreate={() => {
          if (selectedProject) {
            createTask(selectedProject.id);
          }
        }}
      />
      <TaskEditor
        task={editingTask}
        isOpen={Boolean(editingTask)}
        onClose={() => setEditingTaskId(null)}
        onChange={(field, value) => {
          if (!selectedProject || !editingTaskId) {
            return;
          }

          updateProject(selectedProject.id, (project) => ({
            ...project,
            tasks: project.tasks.map((task) =>
              task.id === editingTaskId
                ? {
                    ...task,
                    [field]: value,
                  }
                : task,
            ),
          }));
        }}
        onDelete={() => {
          if (!selectedProject || !editingTaskId) {
            return;
          }

          updateProject(selectedProject.id, (project) => ({
            ...project,
            tasks: project.tasks.filter((task) => task.id !== editingTaskId),
          }));
          setEditingTaskId(null);
        }}
      />
      <ProjectPreview action={previewAction} onClose={() => setPreviewAction(null)} />
    </>
  );
}
