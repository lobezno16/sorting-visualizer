"use client";

import { GitCompare, ArrowLeftRight, PenLine, Timer, Layers } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { useVisualizerStore } from "@/features/visualizer/store/visualizer-store";

export function LiveStatsDashboard() {
  const { metrics, status } = useVisualizerStore();

  if (!metrics && status === "idle") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatsCard title="Comparisons" value="—" icon={GitCompare} />
        <StatsCard title="Swaps" value="—" icon={ArrowLeftRight} />
        <StatsCard title="Writes" value="—" icon={PenLine} />
        <StatsCard title="Time (ms)" value="—" icon={Timer} />
        <StatsCard title="Recursion" value="—" icon={Layers} />
      </div>
    );
  }

  const elapsed =
    metrics?.endTime != null
      ? Math.round(metrics.endTime - metrics.startTime)
      : metrics
        ? Math.round(performance.now() - metrics.startTime)
        : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <StatsCard
        title="Comparisons"
        value={metrics?.comparisons ?? 0}
        icon={GitCompare}
        delay={0}
      />
      <StatsCard
        title="Swaps"
        value={metrics?.swaps ?? 0}
        icon={ArrowLeftRight}
        delay={0.05}
      />
      <StatsCard
        title="Writes"
        value={metrics?.writes ?? 0}
        icon={PenLine}
        delay={0.1}
      />
      <StatsCard
        title="Time (ms)"
        value={elapsed}
        icon={Timer}
        delay={0.15}
      />
      <StatsCard
        title="Recursion"
        value={metrics?.recursionDepth ?? 0}
        icon={Layers}
        delay={0.2}
      />
    </div>
  );
}
