"use client";

import { useCallback, useRef } from "react";
import { ALGORITHMS } from "@/features/algorithms/implementations";
import type { OperationWithMessage } from "@/features/algorithms/types";
import { useVisualizerStore } from "../store/visualizer-store";
import type { BarStatus } from "../store/visualizer-store";

export function useSortRunner() {
  const abortRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const opsRef = useRef<OperationWithMessage[]>([]);
  const stepRef = useRef(0);

  const {
    algorithm,
    speed,
    status,
    setArrayOnly,
    setArray,
    setStatus,
    setBarStates,
    setMetrics,
    setCurrentStep,
    setTotalSteps,
    setCurrentMessage,
    reducedMotion,
  } = useVisualizerStore();

  const applyOperation = useCallback(
    (op: OperationWithMessage, arr: number[]) => {
      const store = useVisualizerStore.getState();
      const states: Record<number, BarStatus> = { ...store.barStates };

      const clearCompareSwap = () => {
        for (const key in states) {
          const s = states[key];
          if (s === "compare" || s === "swap" || s === "active") {
            states[key] = "default";
          }
        }
      };

      switch (op.type) {
        case "compare":
          clearCompareSwap();
          states[op.i] = "compare";
          states[op.j] = "compare";
          break;
        case "swap": {
          clearCompareSwap();
          states[op.i] = "swap";
          states[op.j] = "swap";
          const next = [...arr];
          [next[op.i], next[op.j]] = [next[op.j], next[op.i]];
          setArrayOnly(next);
          break;
        }
        case "overwrite": {
          const next = [...arr];
          next[op.index] = op.value;
          setArrayOnly(next);
          break;
        }
        case "setPivot":
          clearCompareSwap();
          for (const key in states) {
            states[key] = "default";
          }
          states[op.index] = "pivot";
          break;
        case "markSorted":
          states[op.index] = "sorted";
          break;
        case "setActive":
          clearCompareSwap();
          op.indices.forEach((i) => {
            states[i] = "active";
          });
          break;
        case "clearActive":
          for (const key in states) {
            if (states[key] === "active") {
              states[key] = "default";
            }
          }
          break;
        case "complete":
          break;
        default:
          break;
      }

      setBarStates(states);
      if (op.message) setCurrentMessage(op.message);
    },
    [setArrayOnly, setBarStates, setCurrentMessage]
  );

  const playFrom = useCallback(
    async (startIdx: number) => {
      abortRef.current = false;
      const ops = opsRef.current;
      const delay = reducedMotion ? 0 : Math.max(10, 200 - speed * 2);

      for (let i = startIdx; i < ops.length && !abortRef.current; i++) {
        stepRef.current = i;
        setCurrentStep(i + 1);
        applyOperation(ops[i], useVisualizerStore.getState().array);

        if (delay > 0) {
          await new Promise<void>((resolve) => {
            timeoutRef.current = setTimeout(resolve, delay);
          });
        }
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (!abortRef.current) {
        setStatus("complete");
        const store = useVisualizerStore.getState();
        const sortedStates: Record<number, BarStatus> = {};
        store.array.forEach((_, i) => {
          sortedStates[i] = "sorted";
        });
        setBarStates(sortedStates);
      }
    },
    [speed, reducedMotion, setStatus, setCurrentStep, setBarStates, applyOperation]
  );

  const run = useCallback(async () => {
    const { array, algorithm } = useVisualizerStore.getState();
    const sortFn = ALGORITHMS[algorithm];
    if (!sortFn) return;

    const operations: OperationWithMessage[] = [];
    const emit = (op: OperationWithMessage) => operations.push(op);

    setStatus("running");
    const result = sortFn([...array], emit);
    setMetrics(result.metrics);
    setTotalSteps(operations.length);

    opsRef.current = operations;
    stepRef.current = 0;

    await playFrom(0);
  }, [setStatus, setMetrics, setTotalSteps, playFrom]);

  const pause = useCallback(() => {
    abortRef.current = true;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setStatus("paused");
  }, [setStatus]);

  const resume = useCallback(() => {
    if (opsRef.current.length === 0) return;
    setStatus("running");
    playFrom(stepRef.current + 1);
  }, [setStatus, playFrom]);

  const reset = useCallback(() => {
    abortRef.current = true;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    opsRef.current = [];
    stepRef.current = 0;
    useVisualizerStore.getState().reset();
  }, []);

  return { run, pause, resume, reset, status };
}
