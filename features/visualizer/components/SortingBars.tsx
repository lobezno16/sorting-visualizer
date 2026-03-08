"use client";

import { useMemo, memo } from "react";
import { motion } from "motion/react";
import { useVisualizerStore } from "../store/visualizer-store";

const BAR_COLORS = {
  default: "hsl(var(--primary) / 0.4)",
  compare: "hsl(var(--warning) / 0.9)", // Yellow
  swap: "hsl(var(--accent) / 0.9)", // Magenta
  pivot: "hsl(var(--success) / 0.7)", // Green
  sorted: "hsl(var(--success) / 0.9)",
  active: "hsl(var(--secondary) / 0.9)", // Cyan
  range: "hsl(var(--primary) / 0.7)",
};

const BAR_GLOWS = {
  default: "none",
  compare: "0 0 15px 2px hsl(var(--warning) / 0.6)",
  swap: "0 0 20px 4px hsl(var(--accent) / 0.8)",
  pivot: "0 0 10px 1px hsl(var(--success) / 0.4)",
  sorted: "0 0 15px 2px hsl(var(--success) / 0.6)",
  active: "0 0 15px 2px hsl(var(--secondary) / 0.6)",
  range: "0 0 10px 1px hsl(var(--primary) / 0.5)",
};

function Bar({ value, index, maxVal, status }: { value: number; index: number; maxVal: number; status: string }) {
  const height = maxVal > 0 ? (value / maxVal) * 100 : 0;
  const color = BAR_COLORS[status as keyof typeof BAR_COLORS] ?? BAR_COLORS.default;
  const glow = BAR_GLOWS[status as keyof typeof BAR_GLOWS] ?? BAR_GLOWS.default;

  return (
    <motion.div
      layout
      initial={false}
      animate={{
        height: `${height}%`,
        backgroundColor: color,
        boxShadow: glow,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="w-full min-w-[4px] rounded-t-sm transition-colors relative"
      style={{ minHeight: "4px" }}
      aria-label={`Bar ${index + 1}, value ${value}`}
    />
  );
}

const MemoBar = memo(Bar);

export function SortingBars() {
  const { array, barStates } = useVisualizerStore();
  const maxVal = useMemo(() => Math.max(...array, 1), [array]);

  return (
    <div
      className="flex items-end justify-center gap-[2px] h-[280px] px-4 py-4"
      role="img"
      aria-label="Sorting visualization"
    >
      {array.map((value, index) => (
        <MemoBar
          key={index}
          value={value}
          index={index}
          maxVal={maxVal}
          status={barStates[index] ?? "default"}
        />
      ))}
    </div>
  );
}
