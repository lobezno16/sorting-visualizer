"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlgorithmSelector } from "./AlgorithmSelector";
import { ArrayControls } from "./ArrayControls";
import { ControlDock } from "./ControlDock";
import { SortingBars } from "./SortingBars";
import { LiveStatsDashboard } from "@/features/stats/components/LiveStatsDashboard";
import { PseudocodePanel } from "@/features/education/components/PseudocodePanel";
import { Switch } from "@/components/ui/switch";
import { useVisualizerStore } from "../store/visualizer-store";

export function VisualizerPanel() {
  const { teachMode, setTeachMode, generateNewArray } = useVisualizerStore();

  // Generate a random array on mount (client-side only) to avoid hydration mismatch.
  useEffect(() => {
    generateNewArray();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.section
      id="visualizer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="scroll-mt-24"
    >
      <Card className="bg-card/30 border-border/50 backdrop-blur-xl overflow-hidden">
        <CardHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">Sorting Lab</h2>
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={teachMode}
                  onCheckedChange={setTeachMode}
                  aria-label="Toggle teach mode"
                />
                Teach Mode
              </label>
            </div>
            <AlgorithmSelector />
          </div>
          <ArrayControls />
          <ControlDock />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-background/50 border border-border/30 p-4 min-h-[300px]">
            <SortingBars />
          </div>
          <LiveStatsDashboard />
          {teachMode && <PseudocodePanel />}
        </CardContent>
      </Card>
    </motion.section>
  );
}
