"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shuffle, RotateCcw } from "lucide-react";
import { useVisualizerStore } from "../store/visualizer-store";
import type { ArrayPreset } from "../utils/array-generators";

const PRESETS: { value: ArrayPreset; label: string }[] = [
  { value: "random", label: "Random" },
  { value: "nearly-sorted", label: "Nearly Sorted" },
  { value: "reversed", label: "Reversed" },
  { value: "duplicate-heavy", label: "Duplicate Heavy" },
];

export function ArrayControls() {
  const {
    arraySize,
    setArraySize,
    preset,
    setPreset,
    generateNewArray,
    reset,
    status,
  } = useVisualizerStore();

  const disabled = status === "running";

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-3 min-w-[200px]">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          Size
        </span>
        <Slider
          value={[arraySize]}
          onValueChange={([v]) => setArraySize(v)}
          min={8}
          max={64}
          step={4}
          disabled={disabled}
          className="flex-1"
          aria-label="Array size"
        />
        <span className="text-sm font-mono w-8">{arraySize}</span>
      </div>

      <Select
        value={preset}
        onValueChange={(v) => setPreset(v as ArrayPreset)}
        disabled={disabled}
      >
        <SelectTrigger className="w-[160px] bg-card/50 border-border/50" aria-label="Array preset">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PRESETS.map((p) => (
            <SelectItem key={p.value} value={p.value}>
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="sm"
        onClick={generateNewArray}
        disabled={disabled}
        aria-label="Shuffle array"
      >
        <Shuffle className="h-4 w-4" />
        Shuffle
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={reset}
        disabled={disabled}
        aria-label="Reset visualizer"
      >
        <RotateCcw className="h-4 w-4" />
        Reset
      </Button>
    </div>
  );
}
