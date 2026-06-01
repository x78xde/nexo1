"use client";

import type { LucideIcon } from "lucide-react";
import {
  Archive,
  ChevronLeft,
  ChevronRight,
  Download,
  Ellipsis,
  FileCode2,
  FileImage,
  FileText,
  Folder,
  FolderPlus,
  Grip,
  Pencil,
  Plus,
  Search,
  SearchCheck,
  Share,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type FileItem = {
  id: string;
  kind: "file";
  name: string;
  meta: string;
  updated: string;
  icon: LucideIcon;
};

type FolderItem = {
  id: string;
  kind: "folder";
  name: string;
  meta: string;
  updated: string;
  icon: LucideIcon;
  children: ExplorerItem[];
};

export type ExplorerItem = FileItem | FolderItem;

type PreviewAction =
  | { type: "search"; path: string[] }
  | { type: "create-folder"; path: string[] }
  | { type: "upload"; path: string[] }
  | { type: "share"; item: ExplorerItem; path: string[] }
  | { type: "rename"; item: ExplorerItem; path: string[] }
  | { type: "move"; item: ExplorerItem; path: string[] }
  | { type: "delete"; item: ExplorerItem; path: string[] }
  | { type: "download"; item: ExplorerItem; path: string[] };

export const fileTree: FolderItem = {
  id: "nexo",
  kind: "folder",
  name: "nexo",
  meta: "Sistema principal",
  updated: "Base",
  icon: Folder,
  children: [
    {
      id: "proyectos",
      kind: "folder",
      name: "proyectos",
      meta: "Proyectos",
      updated: "Hoy",
      icon: Folder,
      children: [
        {
          id: "servidor-minecraft",
          kind: "folder",
          name: "Servidor minecraft",
          meta: "Proyecto",
          updated: "Editado hoy",
          icon: Folder,
          children: [
            {
              id: "mods",
              kind: "folder",
              name: "mods",
              meta: "Carpeta",
              updated: "Hoy",
              icon: Folder,
              children: [],
            },
            {
              id: "server-properties",
              kind: "file",
              name: "server.properties",
              meta: "Configuracion - 4 KB",
              updated: "Hoy 12:18",
              icon: FileCode2,
            },
            {
              id: "plugins-zip",
              kind: "file",
              name: "plugins.zip",
              meta: "ZIP - 418 MB",
              updated: "Ayer 20:02",
              icon: Archive,
            },
          ],
        },
        {
          id: "documentacion",
          kind: "folder",
          name: "Documentacion",
          meta: "Documentos",
          updated: "Ayer",
          icon: Folder,
          children: [
            {
              id: "manual-proxmox",
              kind: "file",
              name: "manual-proxmox.pdf",
              meta: "PDF - 2.4 MB",
              updated: "Hoy 19:24",
              icon: FileText,
            },
            {
              id: "estructura-nexo",
              kind: "file",
              name: "estructura-nexo.drawio",
              meta: "Diagrama - 860 KB",
              updated: "Hoy 16:10",
              icon: FileCode2,
            },
          ],
        },
        {
          id: "backup-abril-root",
          kind: "file",
          name: "backup-abril.zip",
          meta: "ZIP - 8.7 GB",
          updated: "Ayer 09:12",
          icon: Archive,
        },
      ],
    },
    {
      id: "archivos",
      kind: "folder",
      name: "archivos",
      meta: "Archivos",
      updated: "Ayer",
      icon: Folder,
      children: [
        {
          id: "documentos-base",
          kind: "folder",
          name: "documentos",
          meta: "Documentos",
          updated: "Ayer",
          icon: Folder,
          children: [
            {
              id: "manual-proxmox-root",
              kind: "file",
              name: "manual-proxmox.pdf",
              meta: "PDF - 2.4 MB",
              updated: "Hoy 19:24",
              icon: FileText,
            },
          ],
        },
        {
          id: "multimedia",
          kind: "folder",
          name: "multimedia",
          meta: "Multimedia",
          updated: "Ayer",
          icon: Folder,
          children: [
            {
              id: "panel-preview-root",
              kind: "file",
              name: "panel-preview.png",
              meta: "Imagen - 1.2 MB",
              updated: "Ayer 22:04",
              icon: FileImage,
            },
          ],
        },
        {
          id: "estructura-nexo-root",
          kind: "file",
          name: "estructura-nexo.drawio",
          meta: "Diagrama - 860 KB",
          updated: "Hoy 16:10",
          icon: FileCode2,
        },
      ],
    },
    {
      id: "compartidos",
      kind: "folder",
      name: "compartidos",
      meta: "Compartidos",
      updated: "Hace 3 dias",
      icon: Folder,
      children: [
        {
          id: "compartidos-activos",
          kind: "folder",
          name: "activos",
          meta: "Links activos",
          updated: "Hace 3 dias",
          icon: Folder,
          children: [
            {
              id: "panel-preview-share",
              kind: "file",
              name: "panel-preview.png",
              meta: "Imagen - 1.2 MB",
              updated: "Ayer 22:04",
              icon: FileImage,
            },
          ],
        },
        {
          id: "manual-share",
          kind: "file",
          name: "manual-acceso.pdf",
          meta: "PDF - 1.1 MB",
          updated: "Ayer 18:15",
          icon: FileText,
        },
      ],
    },
  ],
};

export const initialPath = ["nexo"];

export function getFolderFromPath(path: string[]): FolderItem {
  let currentFolder = fileTree;

  for (let index = 1; index < path.length; index += 1) {
    const nextNode = currentFolder.children.find(
      (item): item is FolderItem =>
        item.kind === "folder" && item.id === path[index],
    );

    if (!nextNode) {
      return currentFolder;
    }

    currentFolder = nextNode;
  }

  return currentFolder;
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

  const header =
    action.type === "search"
      ? {
          icon: SearchCheck,
          title: "Buscar en archivos",
          description: "Preview del buscador global dentro de la ruta actual.",
        }
      : action.type === "create-folder"
        ? {
            icon: Plus,
            title: "Nueva carpeta",
            description: "Preview del formulario para crear una carpeta en la ruta actual.",
          }
        : action.type === "upload"
          ? {
              icon: Upload,
              title: "Subir archivos",
              description: "Preview del flujo de carga con arrastrar y soltar o seleccion manual.",
            }
          : action.type === "share"
            ? {
                icon: Share,
                title: "Compartir elemento",
                description: "Preview del flujo para generar un enlace compartido desde el gestor de archivos.",
              }
          : action.type === "rename"
            ? {
                icon: Pencil,
                title: "Renombrar elemento",
                description: "Preview del editor de nombre para carpeta o archivo.",
              }
            : action.type === "move"
              ? {
                  icon: Grip,
                  title: "Mover elemento",
                  description: "Preview del selector de destino para cambiar este elemento de ruta.",
                }
              : action.type === "delete"
                ? {
                    icon: Trash2,
                    title: "Eliminar elemento",
                    description: "Preview de confirmacion antes de borrar permanentemente.",
                  }
                : {
                    icon: Download,
                    title: "Descargar archivo",
                    description: "Preview de descarga con nombre final y tamaño estimado.",
                  };

  const Icon = header.icon;
  const itemLabel = "item" in action ? action.item.name : null;
  const currentPath = `/${action.path.join("/")}`;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 px-4 py-8">
      <div className="panel w-full max-w-xl rounded-[22px] p-5 shadow-[0_24px_64px_rgba(0,0,0,0.45)]">
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
          <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Ruta actual
            </p>
            <p className="mt-2 font-mono text-sm text-zinc-100">{currentPath}</p>
          </div>

          {action.type === "search" ? (
            <>
              <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Campo de busqueda
                </p>
                <div className="mt-3 rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm text-zinc-500">
                  Buscar por nombre, tipo o contenido...
                </div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Resultados simulados
                </p>
                <div className="mt-3 space-y-2 text-sm text-zinc-300">
                  <div className="rounded-xl bg-[#101010] px-3 py-2.5">
                    manual-proxmox.pdf
                  </div>
                  <div className="rounded-xl bg-[#101010] px-3 py-2.5">
                    estructura-nexo.drawio
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {action.type === "create-folder" ? (
            <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                Nombre de carpeta
              </p>
              <div className="mt-3 rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm text-zinc-500">
                nueva-carpeta
              </div>
            </div>
          ) : null}

          {action.type === "upload" ? (
            <>
              <div className="rounded-2xl border border-dashed border-white/10 bg-[#161616] p-6 text-center">
                <p className="text-sm font-medium text-zinc-100">
                  Arrastra archivos aqui
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  O selecciona archivos desde el equipo
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Cola de subida simulada
                </p>
                <div className="mt-3 rounded-xl bg-[#101010] px-3 py-2.5 text-sm text-zinc-300">
                  backup-junio.zip - Preparado
                </div>
              </div>
            </>
          ) : null}

          {action.type === "share" ? (
            <>
              <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Elemento seleccionado
                </p>
                <p className="mt-2 text-sm font-medium text-zinc-100">{itemLabel}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Tipo de acceso
                </p>
                <div className="mt-3 rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm text-zinc-300">
                  Vista previa o descarga
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                    Proteccion
                  </p>
                  <div className="mt-3 rounded-xl bg-[#101010] px-3 py-2.5 text-sm text-zinc-300">
                    Contrasena opcional
                  </div>
                </div>
                <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                    Expiracion
                  </p>
                  <div className="mt-3 rounded-xl bg-[#101010] px-3 py-2.5 text-sm text-zinc-300">
                    7 dias
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {action.type === "rename" ? (
            <>
              <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Elemento seleccionado
                </p>
                <p className="mt-2 text-sm font-medium text-zinc-100">{itemLabel}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Nuevo nombre
                </p>
                <div className="mt-3 rounded-xl border border-white/8 bg-[#101010] px-3 py-2.5 text-sm text-zinc-500">
                  {itemLabel}
                </div>
              </div>
            </>
          ) : null}

          {action.type === "move" ? (
            <>
              <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Elemento
                </p>
                <p className="mt-2 text-sm font-medium text-zinc-100">{itemLabel}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Nueva ubicacion
                </p>
                <div className="mt-3 space-y-2 text-sm text-zinc-300">
                  <div className="rounded-xl bg-[#101010] px-3 py-2.5">/nexo/proyectos</div>
                  <div className="rounded-xl bg-[#101010] px-3 py-2.5">/nexo/archivos</div>
                  <div className="rounded-xl bg-[#101010] px-3 py-2.5">/nexo/compartidos</div>
                </div>
              </div>
            </>
          ) : null}

          {action.type === "delete" ? (
            <>
              <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Elemento a eliminar
                </p>
                <p className="mt-2 text-sm font-medium text-zinc-100">{itemLabel}</p>
                <p className="mt-2 text-sm text-zinc-500">
                  Esta ventana solo muestra el futuro dialogo de confirmacion.
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <div className="rounded-xl border border-white/8 bg-[#161616] px-4 py-2 text-sm text-zinc-300">
                  Cancelar
                </div>
                <div className="rounded-xl border border-white/8 bg-[#2a1517] px-4 py-2 text-sm text-zinc-100">
                  Eliminar
                </div>
              </div>
            </>
          ) : null}

          {action.type === "download" ? (
            <>
              <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Archivo
                </p>
                <p className="mt-2 text-sm font-medium text-zinc-100">{itemLabel}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Descarga simulada
                </p>
                <p className="mt-2 text-sm text-zinc-300">
                  Se descargaria con su nombre original y conservando el formato.
                </p>
              </div>
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

function CardMenu({
  item,
  path,
  onAction,
}: {
  item: ExplorerItem;
  path: string[];
  onAction: (action: PreviewAction) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const options =
    item.kind === "folder"
      ? ["Abrir", "Compartir", "Renombrar", "Mover", "Eliminar"]
      : ["Abrir", "Compartir", "Descargar", "Renombrar", "Mover", "Eliminar"];

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

  const handleOptionClick = (option: string) => {
    setIsOpen(false);

    if (option === "Descargar") {
      onAction({ type: "download", item, path });
      return;
    }

    if (option === "Compartir") {
      onAction({ type: "share", item, path });
      return;
    }

    if (option === "Renombrar") {
      onAction({ type: "rename", item, path });
      return;
    }

    if (option === "Mover") {
      onAction({ type: "move", item, path });
      return;
    }

    if (option === "Eliminar") {
      onAction({ type: "delete", item, path });
      return;
    }

    if (option === "Abrir" && item.kind === "file") {
      onAction({ type: "download", item, path });
    }
  };

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
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleOptionClick(option)}
                className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-zinc-300 transition hover:bg-[#222222] hover:text-zinc-100"
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

function FileCard({
  item,
  path,
  onOpenFolder,
  onAction,
  showMenu,
}: {
  item: ExplorerItem;
  path: string[];
  onOpenFolder: (folderId: string) => void;
  onAction: (action: PreviewAction) => void;
  showMenu: boolean;
}) {
  const isFolder = item.kind === "folder";
  const Icon = item.icon;

  return (
    <article
      onClick={() => {
        if (isFolder) {
          onOpenFolder(item.id);
        }
      }}
      className={`panel rounded-[18px] p-4 transition ${
        isFolder
          ? "cursor-pointer hover:border-white/14 hover:bg-[#1d1d1d]"
          : "hover:border-white/14 hover:bg-[#1d1d1d]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/8 bg-[#161616] text-zinc-300">
          <Icon className="h-5 w-5" />
        </div>
        {showMenu ? <CardMenu item={item} path={path} onAction={onAction} /> : <div className="h-8 w-8" />}
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-zinc-100">{item.name}</p>
        <p className="mt-1 text-sm text-zinc-400">{item.meta}</p>
        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-zinc-500">
          {item.updated}
        </p>
      </div>
    </article>
  );
}

export default function FilesExplorer({
  path,
  onPathChange,
}: {
  path: string[];
  onPathChange: (path: string[]) => void;
}) {
  const [previewAction, setPreviewAction] = useState<PreviewAction | null>(null);

  const currentFolder = getFolderFromPath(path);
  const folders = currentFolder.children.filter(
    (item): item is FolderItem => item.kind === "folder",
  );
  const files = currentFolder.children.filter((item) => item.kind === "file");
  const visibleItems = [...folders, ...files];
  const isRootFolder = path.length === 1;

  const goBack = () => {
    if (path.length > 1) {
      onPathChange(path.slice(0, -1));
    }
  };

  const openFolder = (folderId: string) => {
    onPathChange([...path, folderId]);
  };

  const jumpToIndex = (index: number) => {
    onPathChange(path.slice(0, index + 1));
  };

  const isEmptyFolder = visibleItems.length === 0;

  return (
    <>
      <section>
        <article className="panel rounded-[18px] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={goBack}
                disabled={path.length <= 1}
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/8 bg-[#161616] text-zinc-300 transition hover:bg-[#1d1d1d] disabled:cursor-not-allowed disabled:text-zinc-600"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
                {path.map((segment, index) => {
                  const isLast = index === path.length - 1;

                  return (
                    <div key={`${segment}-${index}`} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => jumpToIndex(index)}
                        className={`rounded-lg px-1.5 py-1 transition ${
                          isLast
                            ? "text-zinc-100"
                            : "hover:bg-[#1d1d1d] hover:text-zinc-200"
                        }`}
                      >
                        {segment}
                      </button>
                      {!isLast ? <ChevronRight className="h-4 w-4" /> : null}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewAction({ type: "search", path })}
                className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#161616] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#1d1d1d]"
              >
                <Search className="h-4 w-4" />
                Buscar
              </button>
              {!isRootFolder ? (
                <>
                  <button
                    type="button"
                    onClick={() => setPreviewAction({ type: "create-folder", path })}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#161616] px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#1d1d1d]"
                  >
                    <FolderPlus className="h-4 w-4" />
                    Nueva carpeta
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewAction({ type: "upload", path })}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#202020] px-3 py-2 text-sm font-medium text-zinc-100 transition hover:bg-[#262626]"
                  >
                    <Upload className="h-4 w-4" />
                    Subir
                  </button>
                </>
              ) : null}
            </div>
          </div>

          {isEmptyFolder ? (
            <div className="mt-6 grid min-h-48 place-items-center rounded-[18px] border border-dashed border-white/10 bg-[#161616] px-6 text-center">
              <div>
                <p className="text-sm font-medium text-zinc-200">Esta carpeta esta vacia</p>
                <p className="mt-2 text-sm text-zinc-500">
                  Puedes volver atras o crear una carpeta nueva en esta ruta.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {visibleItems.map((item) => (
                <FileCard
                  key={item.id}
                  item={item}
                  path={path}
                  onOpenFolder={openFolder}
                  onAction={setPreviewAction}
                  showMenu={!(isRootFolder && item.kind === "folder")}
                />
              ))}
            </div>
          )}
        </article>
      </section>

      <ActionPreview action={previewAction} onClose={() => setPreviewAction(null)} />
    </>
  );
}
