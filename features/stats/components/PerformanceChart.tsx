"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useVisualizerStore } from "@/features/visualizer/store/visualizer-store";
import { ALGORITHM_METADATA } from "@/features/algorithms/metadata";
import type { AlgorithmId } from "@/features/algorithms/types";

interface ChartDataPoint {
  algorithm: string;
  comparisons: number;
  swaps: number;
  writes: number;
  time: number;
}

export function PerformanceChart() {
  const { metrics, algorithm } = useVisualizerStore();

  const data: ChartDataPoint[] = useMemo(() => {
    if (!metrics) return [];
    return [
      {
        algorithm: ALGORITHM_METADATA[algorithm].name,
        comparisons: metrics.comparisons,
        swaps: metrics.swaps,
        writes: metrics.writes,
        time: metrics.endTime
          ? Math.round(metrics.endTime - metrics.startTime)
          : 0,
      },
    ];
  }, [metrics, algorithm]);

  if (data.length === 0) {
    return (
      <Card className="bg-card/30 border-border/50">
        <CardHeader>
          <h3 className="font-semibold">Performance Metrics</h3>
          <p className="text-sm text-muted-foreground">
            Run a sort to see performance charts.
          </p>
        </CardHeader>
      </Card>
    );
  }

  return (
    <motion.section
      id="analytics"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="scroll-mt-24"
    >
      <Card className="bg-card/30 border-border/50">
        <CardHeader>
          <h3 className="font-semibold">Performance Metrics</h3>
          <p className="text-sm text-muted-foreground">
            Actual runtime metrics from your last sort.
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="algorithm" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="comparisons" fill="hsl(263 70% 58%)" name="Comparisons" />
                <Bar dataKey="swaps" fill="hsl(0 84% 60%)" name="Swaps" />
                <Bar dataKey="writes" fill="hsl(142 76% 46%)" name="Writes" />
                <Bar dataKey="time" fill="hsl(199 89% 48%)" name="Time (ms)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}
