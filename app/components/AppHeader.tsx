"use client";

import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { getNavigationByPath } from "../lib/sections";

export default function AppHeader() {
  const pathname = usePathname();
  const currentPage = getNavigationByPath(pathname);

  return (
    <div>
      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-zinc-500">
        {currentPage.label}
      </p>
      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
        <span className="text-zinc-100">NEXO</span>
        <ChevronRight className="h-4 w-4 text-zinc-600" />
        <span>{currentPage.title}</span>
      </div>
    </div>
  );
}
