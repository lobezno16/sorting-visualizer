"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVisualizerStore } from "../store/visualizer-store";
import type { AlgorithmId } from "@/features/algorithms/types";
import { ALGORITHM_METADATA } from "@/features/algorithms/metadata";

const ALGORITHM_IDS: AlgorithmId[] = [
  "bubble",
  "insertion",
  "selection",
  "quick",
  "merge",
  "heap",
];

export function AlgorithmSelector() {
  const { algorithm, setAlgorithm, status } = useVisualizerStore();
  const disabled = status === "running";

  return (
    <Select
      value={algorithm}
      onValueChange={(v) => setAlgorithm(v as AlgorithmId)}
      disabled={disabled}
    >
      <SelectTrigger
        className="w-full min-w-[180px] bg-card/50 border-border/50"
        aria-label="Select sorting algorithm"
      >
        <SelectValue placeholder="Select algorithm" />
      </SelectTrigger>
      <SelectContent>
        {ALGORITHM_IDS.map((id) => (
          <SelectItem key={id} value={id}>
            {ALGORITHM_METADATA[id].name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
