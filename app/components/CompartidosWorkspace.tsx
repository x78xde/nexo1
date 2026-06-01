"use client";

import {
  CalendarClock,
  Copy,
  Ellipsis,
  Eye,
  KeyRound,
  Link2,
  LockKeyhole,
  Plus,
  Search,
  ShieldCheck,
  Slash,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ShareStatus = "Activo" | "Con clave" | "Expira pronto" | "Desactivado";

type ShareItem = {
  id: string;
  name: string;
  path: string;
  url: string;
  status: ShareStatus;
  expires: string;
  downloads: string;
  visibility: string;
  password: boolean;
};

type PreviewAction =
  | { type: "create" }
  | { type: "search" }
  | { type: "copy"; item: ShareItem }
  | { type: "disable"; item: ShareItem }
  | { type: "delete"; item: ShareItem }
  | { type: "details"; item: ShareItem };

const shareItems: ShareItem[] = [
  {
    id: "backup-abril",
    name: "backup-abril.zip",
    path: "/nexo/compartidos/backup-abril.zip",
    url: "https://nexo/share/a8F92k",
    status: "Activo",
    expires: "15 mayo 2026",
    downloads: "12",
    visibility: "Descarga",
    password: false,
  },
  {
    id: "manual-vm",
    name: "manual-vm.pdf",
    path: "/nexo/compartidos/manual-vm.pdf",
    url: "https://nexo/share/m1K2pQ",
    status: "Con clave",
    expires: "20 mayo 2026",
    downloads: "4",
    visibility: "Vista previa",
    password: true,
  },
  {
    id: "minecraft-mods",
    name: "minecraft-mods.zip",
    path: "/nexo/compartidos/minecraft-mods.zip",
    url: "https://nexo/share/z9R1ts",
    status: "Expira pronto",
    expires: "Hoy",
    downloads: "19",
    visibility: "Descarga",
    password: false,
  },
  {
    id: "old-link",
    name: "panel-preview.png",
    path: "/nexo/compartidos/panel-preview.png",
    url: "https://nexo/share/v3M0er",
    status: "Desactivado",
    expires: "Expirado",
    downloads: "2",
    visibility: "Vista previa",
    password: false,
  },
];

function getStatusTone(status: ShareStatus) {
  if (status === "Activo") {
    return "border-emerald-400/15 bg-emerald-400/10 text-emerald-100";
  }

  if (status === "Con clave") {
    return "border-sky-400/15 bg-sky-400/10 text-sky-100";
  }

  if (status === "Expira pronto") {
    return "border-amber-400/15 bg-amber-400/10 text-amber-100";
  }

  return "border-white/8 bg-[#161616] text-zinc-400";
}

function ActionPreview({
  action,
  onClose,
}: {
  action: PreviewAction | null;
  onClose: () => void;
}) {
  if (!action) {
    return null;
  }

  const item = "item" in action ? action.item : null;

  const header =
    action.type === "create"
      ? {
          icon: Plus,
          title: "Nuevo link compartido",
          description: "Preview del flujo para seleccionar archivo y generar un link publico.",
        }
      : action.type === "search"
        ? {
            icon: Search,
            title: "Buscar links",
            description: "Preview del filtro por archivo, token o estado del link.",
          }
        : action.type === "copy"
          ? {
              icon: Copy,
              title: "Copiar link",
              description: "Preview de copiado rapido del enlace publico.",
            }
          : action.type === "disable"
            ? {
                icon: Slash,
                title: "Desactivar link",
                description: "Preview de la accion para invalidar un enlace compartido.",
              }
            : action.type === "delete"
              ? {
                  icon: Trash2,
                  title: "Eliminar link",
                  description: "Preview del dialogo para borrar el registro del enlace.",
                }
              : {
                  icon: Eye,
                  title: "Detalle del enlace",
                  description: "Preview del panel completo de configuracion del link compartido.",
                };

  const Icon = header.icon;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 px-4 py-8">
      <div className="panel w-full max-w-2xl rounded-[22px] p-5 shadow-[0_24px_64px_rgba(0,0,0,0.45)]">
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
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Archivo seleccionado
                </p>
                <div className="mt-3 rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm text-zinc-500">
                  Seleccionar archivo desde /nexo/compartidos
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                    Expiracion
                  </p>
                  <div className="mt-3 rounded-xl bg-[#101010] px-3 py-2.5 text-sm text-zinc-300">
                    7 dias
                  </div>
                </div>
                <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                    Proteccion
                  </p>
                  <div className="mt-3 rounded-xl bg-[#101010] px-3 py-2.5 text-sm text-zinc-300">
                    Contrasena opcional
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {action.type === "search" ? (
            <>
              <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Campo de busqueda
                </p>
                <div className="mt-3 rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm text-zinc-500">
                  Buscar por nombre de archivo, estado o token...
                </div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Filtros simulados
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full bg-[#101010] px-3 py-1.5 text-zinc-300">
                    Activos
                  </span>
                  <span className="rounded-full bg-[#101010] px-3 py-1.5 text-zinc-300">
                    Con clave
                  </span>
                  <span className="rounded-full bg-[#101010] px-3 py-1.5 text-zinc-300">
                    Expiran hoy
                  </span>
                </div>
              </div>
            </>
          ) : null}

          {item ? (
            <>
              <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Archivo
                </p>
                <p className="mt-2 text-sm font-medium text-zinc-100">{item.name}</p>
                <p className="mt-1 text-sm text-zinc-500">{item.path}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Link publico
                </p>
                <p className="mt-2 font-mono text-sm text-zinc-100">{item.url}</p>
              </div>
            </>
          ) : null}

          {action.type === "details" && item ? (
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Expiracion
                </p>
                <p className="mt-2 text-sm text-zinc-100">{item.expires}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Descargas
                </p>
                <p className="mt-2 text-sm text-zinc-100">{item.downloads}</p>
              </div>
            </div>
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

function ShareMenu({
  item,
  onAction,
}: {
  item: ShareItem;
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
    { label: "Detalle", action: () => onAction({ type: "details", item }) },
    { label: "Copiar", action: () => onAction({ type: "copy", item }) },
    { label: "Desactivar", action: () => onAction({ type: "disable", item }) },
    { label: "Eliminar", action: () => onAction({ type: "delete", item }) },
  ];

  return (
    <div
      ref={menuRef}
      className="relative"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="grid h-8 w-8 place-items-center rounded-xl border border-white/8 bg-[#161616] text-zinc-500 transition hover:text-zinc-200"
      >
        <Ellipsis className="h-4 w-4" />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-10 z-20 min-w-[148px] rounded-2xl border border-white/8 bg-[#161616] p-2 shadow-[0_12px_30px_rgba(0,0,0,0.34)]">
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

export default function CompartidosWorkspace() {
  const [previewAction, setPreviewAction] = useState<PreviewAction | null>(null);
  const [selectedId, setSelectedId] = useState(shareItems[0]?.id ?? "");
  const selectedItem =
    shareItems.find((item) => item.id === selectedId) ?? shareItems[0] ?? null;

  return (
    <>
      <div className="space-y-6">
        <section className="panel rounded-[18px] p-4">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">
                Compartidos
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-zinc-100">
                Links compartidos
              </h2>
              
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between rounded-xl border border-white/8 bg-[#161616] px-3 py-2.5 text-sm">
                <span className="text-zinc-400">Links activos</span>
                <span className="font-mono text-zinc-100">6</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/8 bg-[#161616] px-3 py-2.5 text-sm">
                <span className="text-zinc-400">Expiran hoy</span>
                <span className="font-mono text-zinc-100">1</span>
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
              onClick={() => setPreviewAction({ type: "create" })}
              className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#202020] px-3 py-2 text-sm font-medium text-zinc-100 transition hover:bg-[#262626]"
            >
              <Plus className="h-4 w-4" />
              Nuevo link
            </button>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_340px]">
            <div className="space-y-4">
              {shareItems.map((item) => (
                <article
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`panel rounded-[18px] p-4 transition hover:border-white/14 hover:bg-[#1d1d1d] ${
                    selectedItem?.id === item.id ? "border-white/14 bg-[#1d1d1d]" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/8 bg-[#161616] text-zinc-300">
                        {item.password ? (
                          <LockKeyhole className="h-5 w-5" />
                        ) : (
                          <Link2 className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-100">{item.name}</p>
                        <p className="mt-1 text-sm text-zinc-400">{item.path}</p>
                      </div>
                    </div>

                    <ShareMenu item={item} onAction={setPreviewAction} />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs ${getStatusTone(item.status)}`}
                    >
                      {item.status}
                    </span>
                    <span className="rounded-full border border-white/8 bg-[#161616] px-3 py-1 text-xs text-zinc-300">
                      {item.visibility}
                    </span>
                    {item.password ? (
                      <span className="rounded-full border border-white/8 bg-[#161616] px-3 py-1 text-xs text-zinc-300">
                        Contrasena
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-xl border border-white/8 bg-[#161616] px-3 py-3 text-sm">
                      <p className="text-zinc-500">Expira</p>
                      <p className="mt-1 font-mono text-zinc-100">{item.expires}</p>
                    </div>
                    <div className="rounded-xl border border-white/8 bg-[#161616] px-3 py-3 text-sm">
                      <p className="text-zinc-500">Descargas</p>
                      <p className="mt-1 font-mono text-zinc-100">{item.downloads}</p>
                    </div>
                    <div className="rounded-xl border border-white/8 bg-[#161616] px-3 py-3 text-sm">
                      <p className="text-zinc-500">Token</p>
                      <p className="mt-1 font-mono text-zinc-100">
                        {item.url.split("/").at(-1)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setPreviewAction({ type: "copy", item });
                      }}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#161616] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#1d1d1d]"
                    >
                      <Copy className="h-4 w-4" />
                      Copiar link
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setPreviewAction({ type: "disable", item });
                      }}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#161616] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#1d1d1d]"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Desactivar
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {selectedItem ? (
              <aside className="panel rounded-[18px] p-4">
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/8 bg-[#161616] text-zinc-300">
                    {selectedItem.password ? (
                      <KeyRound className="h-5 w-5" />
                    ) : (
                      <Link2 className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-base font-medium text-zinc-100">
                      Detalle del enlace
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">{selectedItem.name}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="rounded-xl border border-white/8 bg-[#161616] px-3 py-3 text-sm">
                    <p className="text-zinc-500">URL publica</p>
                    <p className="mt-1 font-mono text-zinc-100">{selectedItem.url}</p>
                  </div>
                  <div className="rounded-xl border border-white/8 bg-[#161616] px-3 py-3 text-sm">
                    <p className="text-zinc-500">Ruta interna</p>
                    <p className="mt-1 text-zinc-100">{selectedItem.path}</p>
                  </div>
                  <div className="rounded-xl border border-white/8 bg-[#161616] px-3 py-3 text-sm">
                    <p className="text-zinc-500">Estado</p>
                    <p className="mt-1 text-zinc-100">{selectedItem.status}</p>
                  </div>
                  <div className="rounded-xl border border-white/8 bg-[#161616] px-3 py-3 text-sm">
                    <p className="text-zinc-500">Expiracion</p>
                    <p className="mt-1 text-zinc-100">{selectedItem.expires}</p>
                  </div>
                  <div className="rounded-xl border border-white/8 bg-[#161616] px-3 py-3 text-sm">
                    <p className="text-zinc-500">Tipo de acceso</p>
                    <p className="mt-1 text-zinc-100">{selectedItem.visibility}</p>
                  </div>
                  <div className="rounded-xl border border-white/8 bg-[#161616] px-3 py-3 text-sm">
                    <p className="text-zinc-500">Descargas</p>
                    <p className="mt-1 text-zinc-100">{selectedItem.downloads}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewAction({ type: "details", item: selectedItem })}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#161616] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#1d1d1d]"
                  >
                    <Eye className="h-4 w-4" />
                    Ver preview
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewAction({ type: "copy", item: selectedItem })}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#161616] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#1d1d1d]"
                  >
                    <Copy className="h-4 w-4" />
                    Copiar
                  </button>
                </div>

                <div className="mt-5 rounded-2xl border border-white/8 bg-[#161616] p-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#101010] text-zinc-300">
                      <CalendarClock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-100">
                        Comportamiento futuro
                      </p>
                      <p className="mt-1 text-sm text-zinc-500">
                        Aqui despues podras cambiar expiracion, password, limite de descargas y permisos.
                      </p>
                    </div>
                  </div>
                </div>
              </aside>
            ) : null}
          </div>
        </section>
      </div>

      <ActionPreview action={previewAction} onClose={() => setPreviewAction(null)} />
    </>
  );
}
