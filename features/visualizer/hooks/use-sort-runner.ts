"use client";

import { useCallback, useRef } from "react";
import { ALGORITHMS } from "@/features/algorithms/implementations";
import type { OperationWithMessage } from "@/features/algorithms/types";
import { useVisualizerStore } from "../store/visualizer-store";
import type { BarStatus } from "../store/visualizer-store";
import { initAudio, playTone } from "../utils/audio";

export function useSortRunner() {
  const abortRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const opsRef = useRef<OperationWithMessage[]>([]);
  const stepRef = useRef(0);

  const {
    status,
    setArrayOnly,
    setStatus,
    setBarStates,
    setMetrics,
    setCurrentStep,
    setTotalSteps,
    setCurrentMessage,
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

      const clearNonSorted = () => {
        for (const key in states) {
          if (states[key] !== "sorted") {
            states[key] = "default";
          }
        }
      };

      const maxVal = Math.max(...store.array, 1);

      switch (op.type) {
        case "compare":
          clearCompareSwap();
          states[op.i] = "compare";
          states[op.j] = "compare";
          if (store.soundEnabled) {
            playTone(arr[op.i], maxVal, "compare");
            playTone(arr[op.j], maxVal, "compare");
          }
          break;

        case "swap": {
          clearCompareSwap();
          states[op.i] = "swap";
          states[op.j] = "swap";
          const next = [...arr];
          [next[op.i], next[op.j]] = [next[op.j], next[op.i]];
          setArrayOnly(next);
          if (store.soundEnabled) {
            playTone(next[op.i], maxVal, "swap");
            playTone(next[op.j], maxVal, "swap");
          }
          break;
        }

        case "overwrite": {
          clearCompareSwap();
          states[op.index] = "active";
          const next = [...arr];
          next[op.index] = op.value;
          setArrayOnly(next);
          if (store.soundEnabled) {
            playTone(op.value, maxVal, "swap");
          }
          break;
        }

        case "setPivot":
          clearNonSorted();
          states[op.index] = "pivot";
          if (store.soundEnabled) {
            playTone(arr[op.index], maxVal, "active");
          }
          break;

        case "markSorted":
          states[op.index] = "sorted";
          if (store.soundEnabled) {
            playTone(arr[op.index], maxVal, "sorted");
          }
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

        case "setRange":
          for (const key in states) {
            const s = states[key];
            if (s !== "sorted" && s !== "pivot") {
              states[key] = "default";
            }
          }
          for (let i = op.start; i <= op.end; i++) {
            states[i] = "range";
          }
          break;

        case "setHeapBoundary":
          for (let i = 0; i <= op.index; i++) {
            if (states[i] !== "sorted") {
              states[i] = "range";
            }
          }
          break;

        case "setMergeSegment":
          for (const key in states) {
            if (states[key] !== "sorted") {
              states[key] = "default";
            }
          }
          for (let i = op.start; i <= op.end; i++) {
            states[i] = "range";
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
      initAudio(); // Required to unlock audio on first user interaction
      abortRef.current = false;
      const ops = opsRef.current;

      for (let i = startIdx; i < ops.length && !abortRef.current; i++) {
        stepRef.current = i;
        setCurrentStep(i + 1);
        applyOperation(ops[i], useVisualizerStore.getState().array);

        // Read speed from the store on EVERY tick so slider changes
        // take effect immediately during animation.
        const { speed, reducedMotion } = useVisualizerStore.getState();
        const delay = reducedMotion ? 0 : Math.max(5, 200 - speed * 2);

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
    [setStatus, setCurrentStep, setBarStates, applyOperation]
  );

  const run = useCallback(async () => {
    initAudio(); // Required to unlock audio on first user interaction
    // Guard: don't start if already running
    const currentStatus = useVisualizerStore.getState().status;
    if (currentStatus === "running") return;

    const { array, algorithm } = useVisualizerStore.getState();
    const sortFn = ALGORITHMS[algorithm];
    if (!sortFn) return;

    // Reset bar states and metrics before starting
    setBarStates({});
    setCurrentMessage("");

    const operations: OperationWithMessage[] = [];
    const emit = (op: OperationWithMessage) => operations.push(op);

    setStatus("running");
    const result = sortFn([...array], emit);
    setMetrics(result.metrics);
    setTotalSteps(operations.length);

    opsRef.current = operations;
    stepRef.current = 0;

    await playFrom(0);
  }, [setStatus, setMetrics, setTotalSteps, setBarStates, setCurrentMessage, playFrom]);

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
