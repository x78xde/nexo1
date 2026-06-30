"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  detail?: string;
  change: string;
  icon: LucideIcon;
  trend?: number[];
}

export default function MetricCard({
  title,
  value,
  detail,
  change,
  icon: Icon,
  trend,
}: MetricCardProps) {
  const normalizedTrend =
    trend && trend.length > 0
      ? trend.map((point) => Math.max(12, Math.min(100, point)))
      : null;

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      className="panel rounded-[18px] p-3.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <p className="mt-2 text-[1.85rem] font-semibold tracking-tight text-zinc-100 transition-all duration-500">
            {value}
          </p>
        </div>
        <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/8 bg-[#161616] text-zinc-300">
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        {normalizedTrend ? (
          <div className="flex h-14 items-end gap-1.5 border border-white/8 px-2.5 py-2">
            {normalizedTrend.map((point, index) => (
              <span
                key={`${title}-trend-${index}`}
                className="w-2 rounded-[2px] bg-zinc-300/90 transition-all duration-500"
                style={{ height: `${point}%` }}
              />
            ))}
          </div>
        ) : detail ? (
          <p className="text-sm text-zinc-500">{detail}</p>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-1 rounded-full border border-white/8 bg-[#161616] px-2.5 py-1 text-xs font-medium text-zinc-300">
          <ArrowUpRight className="h-3.5 w-3.5" />
          {change}
        </div>
      </div>
    </motion.article>
  );
}
