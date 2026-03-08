"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  Play,
  Shuffle,
  Trophy,
  GitCompare,
  ArrowLeftRight,
  PenLine,
  Timer,
  Layers,
  Crown,
  Hash,
} from "lucide-react";
import { ALGORITHMS } from "@/features/algorithms/implementations";
import { ALGORITHM_METADATA } from "@/features/algorithms/metadata";
import type { AlgorithmId } from "@/features/algorithms/types";
import type { OperationWithMessage, SortMetrics } from "@/features/algorithms/types";
import { generateArray } from "@/features/visualizer/utils/array-generators";
import type { ArrayPreset } from "@/features/visualizer/utils/array-generators";

const PRESETS: { value: ArrayPreset; label: string }[] = [
  { value: "random", label: "Random" },
  { value: "nearly-sorted", label: "Nearly Sorted" },
  { value: "reversed", label: "Reversed" },
  { value: "duplicate-heavy", label: "Duplicate Heavy" },
];

const ALGORITHM_IDS: AlgorithmId[] = [
  "bubble",
  "insertion",
  "selection",
  "quick",
  "merge",
  "heap",
];

type BarStatus = "default" | "compare" | "swap" | "sorted" | "active" | "pivot" | "range";

interface AlgoSnapshot {
  array: number[];
  barStates: Record<number, BarStatus>;
  step: number;
  totalSteps: number;
  done: boolean;
}

interface RunResult {
  algorithmId: AlgorithmId;
  metrics: SortMetrics;
  durationUs: number; // microseconds
  operations: OperationWithMessage[];
  finalArray: number[];
}

// ─── Mini bar visualisation for one algorithm ────────────────────────────
const BAR_COLORS: Record<BarStatus, string> = {
  default: "hsl(var(--primary) / 0.5)",
  compare: "hsl(var(--warning) / 0.9)",
  swap: "hsl(var(--accent) / 0.9)",
  pivot: "hsl(var(--success) / 0.7)",
  sorted: "hsl(var(--success) / 0.9)",
  active: "hsl(var(--secondary) / 0.9)",
  range: "hsl(var(--primary) / 0.8)",
};

function MiniBars({
  array,
  barStates,
}: {
  array: number[];
  barStates: Record<number, BarStatus>;
}) {
  const maxVal = useMemo(() => Math.max(...array, 1), [array]);

  return (
    <div className="flex items-end gap-[1px] h-[120px] w-full px-1">
      {array.map((value, i) => {
        const height = maxVal > 0 ? (value / maxVal) * 100 : 0;
        const status = barStates[i] ?? "default";
        return (
          <div
            key={i}
            className="flex-1 min-w-[2px] rounded-t transition-all duration-100"
            style={{
              height: `${height}%`,
              backgroundColor: BAR_COLORS[status],
              minHeight: "2px",
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Apply a single operation to a snapshot ──────────────────────────────
function applyOp(
  op: OperationWithMessage,
  arr: number[],
  states: Record<number, BarStatus>
): { arr: number[]; states: Record<number, BarStatus> } {
  const next = [...arr];
  const s = { ...states };

  const clearTransient = () => {
    for (const k in s) {
      const v = s[k];
      if (v === "compare" || v === "swap" || v === "active") s[k] = "default";
    }
  };

  switch (op.type) {
    case "compare":
      clearTransient();
      s[op.i] = "compare";
      s[op.j] = "compare";
      break;
    case "swap":
      clearTransient();
      s[op.i] = "swap";
      s[op.j] = "swap";
      [next[op.i], next[op.j]] = [next[op.j], next[op.i]];
      break;
    case "overwrite":
      clearTransient();
      s[op.index] = "active";
      next[op.index] = op.value;
      break;
    case "setPivot":
      for (const k in s) if (s[k] !== "sorted") s[k] = "default";
      s[op.index] = "pivot";
      break;
    case "markSorted":
      s[op.index] = "sorted";
      break;
    case "setActive":
      clearTransient();
      op.indices.forEach((i) => (s[i] = "active"));
      break;
    case "clearActive":
      for (const k in s) if (s[k] === "active") s[k] = "default";
      break;
    case "setRange":
      for (const k in s) if (s[k] !== "sorted" && s[k] !== "pivot") s[k] = "default";
      for (let i = op.start; i <= op.end; i++) s[i] = "range";
      break;
    case "setHeapBoundary":
      for (let i = 0; i <= op.index; i++) if (s[i] !== "sorted") s[i] = "range";
      break;
    case "setMergeSegment":
      for (const k in s) if (s[k] !== "sorted") s[k] = "default";
      for (let i = op.start; i <= op.end; i++) s[i] = "range";
      break;
    case "complete":
      break;
  }

  return { arr: next, states: s };
}

// ─── Metric row ─────────────────────────────────────────────────────────
function MetricRow({
  icon: Icon,
  label,
  value,
  best,
  suffix,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  best: boolean;
  suffix?: string;
}) {
  const display = typeof value === "number" ? value.toLocaleString() : value;
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </div>
      <span className={best ? "font-bold text-green-400" : "font-mono"}>
        {display}{suffix ? ` ${suffix}` : ""}
        {best && <Crown className="inline h-3 w-3 ml-1 text-yellow-400" />}
      </span>
    </div>
  );
}

// ─── Progress bar ───────────────────────────────────────────────────────
function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="h-1.5 w-full rounded-full bg-muted/30 overflow-hidden">
      <motion.div
        className="h-full rounded-full bg-primary"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────
export function ComparisonGrid() {
  const [compSize, setCompSize] = useState(32);
  const [compPreset, setCompPreset] = useState<ArrayPreset>("random");
  const [selected, setSelected] = useState<AlgorithmId[]>([]);
  const [results, setResults] = useState<RunResult[]>([]);
  const [running, setRunning] = useState(false);
  const [array, setArray] = useState<number[]>(() =>
    generateArray(32, "random")
  );

  // Live animation state: one snapshot per selected algorithm
  const [snapshots, setSnapshots] = useState<Record<AlgorithmId, AlgoSnapshot>>(
    {} as Record<AlgorithmId, AlgoSnapshot>
  );
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepsRef = useRef<Record<AlgorithmId, number>>({} as Record<AlgorithmId, number>);

  useEffect(() => {
    setArray(generateArray(compSize, compPreset));
    setResults([]);
    setSnapshots({} as Record<AlgorithmId, AlgoSnapshot>);
  }, [compSize, compPreset]);

  const shuffleArray = () => {
    setArray(generateArray(compSize, compPreset));
    setResults([]);
    setSnapshots({} as Record<AlgorithmId, AlgoSnapshot>);
  };

  const toggleAlgorithm = (id: AlgorithmId) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ── Run comparison with animated playback ──────────────────────────
  const runComparison = useCallback(() => {
    if (selected.length === 0) return;
    setRunning(true);
    setResults([]);

    const testArray = [...array];
    const allResults: RunResult[] = [];

    // Pre-compute all operations
    for (const id of selected) {
      const sortFn = ALGORITHMS[id];
      const operations: OperationWithMessage[] = [];
      const emit = (op: OperationWithMessage) => operations.push(op);
      const result = sortFn([...testArray], emit);
      // Store duration in microseconds for precision
      const durationMs = (result.metrics.endTime ?? performance.now()) - result.metrics.startTime;
      allResults.push({
        algorithmId: id,
        metrics: result.metrics,
        durationUs: Math.round(durationMs * 1000), // convert ms → µs
        operations,
        finalArray: result.finalArray,
      });
    }

    // Initialise snapshots
    const initSnaps: Record<string, AlgoSnapshot> = {};
    const initSteps: Record<string, number> = {};
    for (const r of allResults) {
      initSnaps[r.algorithmId] = {
        array: [...testArray],
        barStates: {},
        step: 0,
        totalSteps: r.operations.length,
        done: false,
      };
      initSteps[r.algorithmId] = 0;
    }
    setSnapshots(initSnaps as Record<AlgorithmId, AlgoSnapshot>);
    stepsRef.current = initSteps as Record<AlgorithmId, number>;

    // Determine the max number of steps across all algorithms
    const maxSteps = Math.max(...allResults.map((r) => r.operations.length));

    // Steps per tick: scale aggressively so animation finishes in ~3-4 seconds
    // For 500-element Bubble Sort (~125k ops), this gives ~625 ops/tick → ~200 frames
    const opsPerTick = Math.max(1, Math.floor(maxSteps / 200));

    let tick = 0;
    const animate = () => {
      setSnapshots((prev) => {
        const next = { ...prev };
        let allDone = true;

        for (const r of allResults) {
          const id = r.algorithmId;
          const snap = next[id];
          if (snap.done) continue;

          let currentArr = [...snap.array];
          let currentStates = { ...snap.barStates };
          let step = snap.step;

          for (let t = 0; t < opsPerTick && step < r.operations.length; t++) {
            const result = applyOp(r.operations[step], currentArr, currentStates);
            currentArr = result.arr;
            currentStates = result.states;
            step++;
          }

          const done = step >= r.operations.length;
          if (done) {
            // Mark all sorted
            currentArr = r.finalArray;
            currentStates = {};
            currentArr.forEach((_, i) => (currentStates[i] = "sorted"));
          } else {
            allDone = false;
          }

          next[id] = {
            array: currentArr,
            barStates: currentStates,
            step,
            totalSteps: r.operations.length,
            done,
          };
        }

        if (allDone) {
          setResults(allResults);
          setRunning(false);
        }

        return next;
      });

      tick++;
      // Check if we should keep animating
      const stillRunning = allResults.some(
        (r) => (stepsRef.current[r.algorithmId] ?? 0) < r.operations.length
      );

      // Use the snapshots to update stepsRef
      setSnapshots((prev) => {
        for (const r of allResults) {
          stepsRef.current[r.algorithmId] = prev[r.algorithmId]?.step ?? 0;
        }
        return prev;
      });

      if (tick * opsPerTick < maxSteps) {
        animRef.current = setTimeout(animate, 16); // ~60fps
      }
    };

    animRef.current = setTimeout(animate, 50);

    return () => {
      if (animRef.current) clearTimeout(animRef.current);
    };
  }, [selected, array]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animRef.current) clearTimeout(animRef.current);
    };
  }, []);

  // ── Derive winners ────────────────────────────────────────────────
  const winners = useMemo(() => {
    if (results.length === 0) return null;
    return {
      time: results.reduce((a, b) => (a.durationUs < b.durationUs ? a : b)).algorithmId,
      comparisons: results.reduce((a, b) =>
        a.metrics.comparisons <= b.metrics.comparisons ? a : b
      ).algorithmId,
      swaps: results.reduce((a, b) =>
        a.metrics.swaps <= b.metrics.swaps ? a : b
      ).algorithmId,
      writes: results.reduce((a, b) =>
        a.metrics.writes <= b.metrics.writes ? a : b
      ).algorithmId,
    };
  }, [results]);

  // Overall winner: use time first, break ties by comparisons
  const overallWinner = useMemo(() => {
    if (results.length === 0) return null;
    return results.reduce((a, b) => {
      if (a.durationUs !== b.durationUs) return a.durationUs < b.durationUs ? a : b;
      return a.metrics.comparisons <= b.metrics.comparisons ? a : b;
    });
  }, [results]);

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
            Watch algorithms race side-by-side on the same array with live visualizations.
          </p>
        </div>

        {/* Controls */}
        <Card className="bg-black/40 border-primary/20 backdrop-blur-xl shadow-[0_0_20px_-5px_rgba(180,90,255,0.15)] overflow-hidden">
          <CardHeader className="space-y-4 relative">
            <div className="absolute inset-0 bg-grid-cyber opacity-10 pointer-events-none" />
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

            {/* Array size + preset controls */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 min-w-[200px]">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Size</span>
                <Slider
                  value={[compSize]}
                  onValueChange={([v]) => setCompSize(v)}
                  min={8}
                  max={500}
                  step={10}
                  disabled={running}
                  className="flex-1"
                  aria-label="Comparison array size"
                />
                <span className="text-sm font-mono w-8">{compSize}</span>
              </div>
              <Select
                value={compPreset}
                onValueChange={(v) => setCompPreset(v as ArrayPreset)}
                disabled={running}
              >
                <SelectTrigger
                  className="w-[160px] bg-black/50 border-primary/30 hover:border-primary/50 transition-colors"
                  aria-label="Array preset"
                >
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
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={shuffleArray}
                disabled={running}
              >
                <Shuffle className="h-4 w-4" />
                New Array
              </Button>
              <Button
                size="sm"
                onClick={runComparison}
                disabled={selected.length === 0 || running}
              >
                <Play className="h-4 w-4" />
                {running ? "Racing..." : "Run Comparison"}
              </Button>
              <div className="flex items-center gap-1.5 ml-auto text-sm text-muted-foreground">
                <Hash className="h-3.5 w-3.5" />
                <span className="font-mono">{array.length}</span>
                <span>elements</span>
                <span className="text-muted-foreground/50">·</span>
                <span>{PRESETS.find((p) => p.value === compPreset)?.label}</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Overall Winner Banner */}
        {overallWinner && !running && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-gradient-to-r from-success/10 via-primary/10 to-success/10 border border-success/30 shadow-[0_0_20px_rgba(180,90,255,0.2)]"
          >
            <Trophy className="h-6 w-6 text-success drop-shadow-[0_0_8px_rgba(70,255,70,0.8)]" />
            <span className="text-lg font-bold">
              Winner: {ALGORITHM_METADATA[overallWinner.algorithmId].name}
            </span>
            <span className="text-muted-foreground">
              — {overallWinner.durationUs.toLocaleString()} µs
            </span>
            <span className="text-muted-foreground/60 text-sm">
              ({array.length} elements, {PRESETS.find((p) => p.value === compPreset)?.label})
            </span>
          </motion.div>
        )}

        {/* Side-by-side visualizations */}
        {(running || results.length > 0) && (
          <div
            className={`grid gap-4 ${selected.length === 1
              ? "grid-cols-1"
              : selected.length === 2
                ? "grid-cols-1 md:grid-cols-2"
                : selected.length <= 4
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}
          >
            {selected.map((id) => {
              const snap = snapshots[id];
              const result = results.find((r) => r.algorithmId === id);
              const meta = ALGORITHM_METADATA[id];
              const isWinner = overallWinner?.algorithmId === id;

              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <Card
                    className={`bg-black/60 border-primary/20 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-all ${isWinner && !running
                      ? "border-success/50 ring-1 ring-success/30 shadow-[0_0_30px_rgba(70,255,70,0.2)]"
                      : "hover:border-primary/40"
                      }`}
                  >
                    <CardHeader className="pb-2 bg-gradient-to-b from-primary/5 to-transparent">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          {isWinner && !running && (
                            <Trophy className="h-4 w-4 text-yellow-400" />
                          )}
                          {meta.name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${meta.stable
                              ? "bg-green-500/20 text-green-400"
                              : "bg-amber-500/20 text-amber-400"
                              }`}
                          >
                            {meta.stable ? "Stable" : "Unstable"}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                            {meta.worstCase}
                          </span>
                        </div>
                      </div>
                      {/* Progress */}
                      {snap && (
                        <div className="mt-2 space-y-1">
                          <ProgressBar
                            current={snap.step}
                            total={snap.totalSteps}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                              Step {snap.step.toLocaleString()} /{" "}
                              {snap.totalSteps.toLocaleString()}
                            </span>
                            <span>{snap.done ? "✓ Complete" : "Running..."}</span>
                          </div>
                        </div>
                      )}
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {/* Mini bars visualization */}
                      {snap && (
                        <div className="rounded-md bg-black/50 border border-primary/20 p-2 shadow-inner relative overflow-hidden">
                          <div className="absolute inset-0 bg-dot-cyber opacity-10 pointer-events-none" />
                          <MiniBars
                            array={snap.array}
                            barStates={snap.barStates}
                          />
                        </div>
                      )}

                      {/* Detailed metrics */}
                      {result && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-2 pt-2 border-t border-border/20"
                        >
                          <MetricRow
                            icon={GitCompare}
                            label="Comparisons"
                            value={result.metrics.comparisons}
                            best={winners?.comparisons === id}
                          />
                          <MetricRow
                            icon={ArrowLeftRight}
                            label="Swaps"
                            value={result.metrics.swaps}
                            best={winners?.swaps === id}
                          />
                          <MetricRow
                            icon={PenLine}
                            label="Writes"
                            value={result.metrics.writes}
                            best={winners?.writes === id}
                          />
                          <MetricRow
                            icon={Timer}
                            label="Time"
                            value={result.durationUs.toLocaleString()}
                            best={winners?.time === id}
                            suffix="µs"
                          />
                          <MetricRow
                            icon={Layers}
                            label="Recursion Depth"
                            value={result.metrics.recursionDepth}
                            best={false}
                          />
                          <div className="pt-2 text-xs text-muted-foreground">
                            Space: <code className="bg-muted px-1 rounded">{meta.spaceComplexity}</code>
                            {" · "}
                            Best: <code className="bg-muted px-1 rounded">{meta.bestCase}</code>
                            {" · "}
                            Avg: <code className="bg-muted px-1 rounded">{meta.averageCase}</code>
                            {" · "}
                            Worst: <code className="bg-muted px-1 rounded">{meta.worstCase}</code>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.section>
  );
}
