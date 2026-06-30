"use client";

import { useEffect, useState } from "react";

type RefreshIndicatorProps = {
  lastUpdatedAt: number | null;
  isFresh: boolean;
};

export default function RefreshIndicator({ lastUpdatedAt, isFresh }: RefreshIndicatorProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const seconds = lastUpdatedAt ? Math.max(0, Math.floor((now - lastUpdatedAt) / 1000)) : null;

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-[#161616] px-3 py-1.5 text-xs text-zinc-400">
      <span
        className={`h-2 w-2 rounded-full bg-emerald-400 transition-shadow duration-500 ${
          isFresh ? "animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.85)]" : "opacity-60"
        }`}
      />
      {seconds === null ? "Sin actualizar" : `Actualizado hace ${seconds}s`}
    </div>
  );
}
