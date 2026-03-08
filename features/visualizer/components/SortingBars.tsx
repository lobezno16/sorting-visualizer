"use client";

import { useMemo, memo } from "react";
import { motion } from "motion/react";
import { useVisualizerStore } from "../store/visualizer-store";

const BAR_COLORS = {
  default: "hsl(263 70% 58% / 0.6)",
  compare: "hsl(45 93% 47%)",
  swap: "hsl(0 84% 60%)",
  pivot: "hsl(142 76% 36%)",
  sorted: "hsl(142 76% 46%)",
  active: "hsl(199 89% 48%)",
  range: "hsl(263 70% 58% / 0.8)",
};

function Bar({ value, index, maxVal, status }: { value: number; index: number; maxVal: number; status: string }) {
  const height = maxVal > 0 ? (value / maxVal) * 100 : 0;
  const color = BAR_COLORS[status as keyof typeof BAR_COLORS] ?? BAR_COLORS.default;

  return (
    <motion.div
      layout
      initial={false}
      animate={{
        height: `${height}%`,
        backgroundColor: color,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full min-w-[4px] rounded-t transition-colors"
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
