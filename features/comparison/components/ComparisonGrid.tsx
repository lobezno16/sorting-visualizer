"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Play, Shuffle } from "lucide-react";
import { ALGORITHMS } from "@/features/algorithms/implementations";
import { ALGORITHM_METADATA } from "@/features/algorithms/metadata";
import type { AlgorithmId } from "@/features/algorithms/types";
import type { SortMetrics } from "@/features/algorithms/types";
import { generateArray } from "@/features/visualizer/utils/array-generators";
import { useVisualizerStore } from "@/features/visualizer/store/visualizer-store";

const ALGORITHM_IDS: AlgorithmId[] = [
  "bubble",
  "insertion",
  "selection",
  "quick",
  "merge",
  "heap",
];

interface RunResult {
  algorithmId: AlgorithmId;
  metrics: SortMetrics;
  duration: number;
}

export function ComparisonGrid() {
  const { arraySize } = useVisualizerStore();
  const [selected, setSelected] = useState<AlgorithmId[]>([]);
  const [results, setResults] = useState<RunResult[]>([]);
  const [running, setRunning] = useState(false);
  const [array, setArray] = useState<number[]>(() =>
    generateArray(arraySize, "random")
  );

  useEffect(() => {
    setArray(generateArray(arraySize, "random"));
    setResults([]);
  }, [arraySize]);

  const shuffleArray = () => {
    setArray(generateArray(arraySize, "random"));
  };

  const toggleAlgorithm = (id: AlgorithmId) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const runComparison = async () => {
    if (selected.length === 0) return;
    setRunning(true);
    setResults([]);

    const testArray = [...array];
    const runResults: RunResult[] = [];

    for (const id of selected) {
      const sortFn = ALGORITHMS[id];
      const result = sortFn([...testArray], () => { });

      runResults.push({
        algorithmId: id,
        metrics: result.metrics,
        duration: Math.round(
          (result.metrics.endTime ?? performance.now()) - result.metrics.startTime
        ),
      });
    }

    setResults(runResults);
    setRunning(false);
  };

  const winner = results.length > 0
    ? results.reduce((a, b) => (a.duration < b.duration ? a : b))
    : null;

  return (
    <motion.section
      id="comparison"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="scroll-mt-24"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Compare Algorithms</h2>
          <p className="text-muted-foreground mt-1">
            Run multiple algorithms on the same array and compare performance.
          </p>
        </div>

        <Card className="bg-card/30 border-border/50">
          <CardHeader>
            <div className="flex flex-wrap gap-2">
              {ALGORITHM_IDS.map((id) => (
                <Button
                  key={id}
                  variant={selected.includes(id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleAlgorithm(id)}
                  disabled={running}
                >
                  {selected.includes(id) && <Check className="h-4 w-4" />}
                  {ALGORITHM_METADATA[id].name}
                </Button>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                onClick={shuffleArray}
                disabled={running}
              >
                <Shuffle className="h-4 w-4" />
                New Array
              </Button>
              <Button
                onClick={runComparison}
                disabled={selected.length === 0 || running}
              >
                <Play className="h-4 w-4" />
                Run Comparison
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {results.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold">
                  {winner && `Winner: ${ALGORITHM_METADATA[winner.algorithmId].name}`}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((r) => (
                    <Card
                      key={r.algorithmId}
                      className={
                        winner?.algorithmId === r.algorithmId
                          ? "border-primary/50 bg-primary/5"
                          : ""
                      }
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          {ALGORITHM_METADATA[r.algorithmId].name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-1">
                        <p>Comparisons: {r.metrics.comparisons}</p>
                        <p>Swaps: {r.metrics.swaps}</p>
                        <p>Writes: {r.metrics.writes}</p>
                        <p>Time: {r.duration}ms</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
}
