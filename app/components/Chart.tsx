"use client";

import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

interface ChartDatum {
  label: string;
  value: number;
}

interface ChartProps {
  title: string;
  subtitle: string;
  value: string;
  accent: string;
  data: ChartDatum[];
}

export default function Chart({
  title,
  subtitle,
  value,
  accent,
  data,
}: ChartProps) {
  const gradientId = `gradient-${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="panel rounded-[18px] p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-base font-medium text-zinc-100">{title}</p>
          <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>
        </div>
        <div className="rounded-xl border border-white/8 bg-[#161616] px-3 py-2 text-right">
          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">
            Ahora
          </p>
          <p className="mt-1 text-lg font-semibold text-zinc-100">{value}</p>
        </div>
      </div>

      <div className="mt-5 h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 0, left: -18, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity={0.22} />
                <stop offset="100%" stopColor={accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255, 255, 255, 0.06)" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ stroke: "rgba(255, 255, 255, 0.12)", strokeWidth: 1 }}
              contentStyle={{
                background: "#1b1b1b",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px",
                color: "#e5e5e5",
              }}
              labelStyle={{ color: "#a1a1aa" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={accent}
              strokeWidth={2.4}
              fill={`url(#${gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
}
