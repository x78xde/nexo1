"use client";

import { useState } from "react";
import FilesExplorer, { initialPath } from "./FilesExplorer";

export default function ArchivosWorkspace() {
  const [path, setPath] = useState(initialPath);

  const currentRoute = `/${path.join("/")}`;

  return (
    <div className="space-y-6">
      <section className="panel rounded-[18px] p-4">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">
              Archivos
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-100">
              Gestor de archivos
            </h2>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between rounded-xl border border-white/8 bg-[#161616] px-3 py-2.5 text-sm">
              <span className="text-zinc-400">Ruta actual</span>
              <span className="font-mono text-zinc-100">{currentRoute}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/8 bg-[#161616] px-3 py-2.5 text-sm">
              <span className="text-zinc-400">Espacio usado</span>
              <span className="font-mono text-zinc-100">202 GB</span>
            </div>
          </div>
        </div>
      </section>

      <FilesExplorer path={path} onPathChange={setPath} />
    </div>
  );
}
