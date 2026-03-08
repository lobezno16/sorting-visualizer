import { create } from "zustand";
import type { AlgorithmId } from "@/features/algorithms/types";
import type { SortMetrics } from "@/features/algorithms/types";
import type { ArrayPreset } from "../utils/array-generators";
import { generateArray } from "../utils/array-generators";

export type VisualizerStatus = "idle" | "running" | "paused" | "complete";

export type BarStatus = "default" | "compare" | "swap" | "pivot" | "sorted" | "active" | "range";

export interface BarState {
  index: number;
  value: number;
  status: BarStatus;
}

export interface VisualizerState {
  array: number[];
  barStates: Record<number, BarStatus>;
  algorithm: AlgorithmId;
  status: VisualizerStatus;
  speed: number;
  arraySize: number;
  preset: ArrayPreset;
  metrics: SortMetrics | null;
  currentStep: number;
  totalSteps: number;
  currentMessage: string;
  teachMode: boolean;
  comparisonAlgorithms: AlgorithmId[];
  theme: "dark" | "light";
  reducedMotion: boolean;
  soundEnabled: boolean;
}

export interface VisualizerActions {
  setAlgorithm: (id: AlgorithmId) => void;
  setArray: (arr: number[]) => void;
  setArrayOnly: (arr: number[]) => void;
  setArraySize: (size: number) => void;
  setPreset: (preset: ArrayPreset) => void;
  generateNewArray: () => void;
  setSpeed: (speed: number) => void;
  setStatus: (status: VisualizerStatus) => void;
  setBarState: (index: number, status: BarStatus) => void;
  setBarStates: (states: Record<number, BarStatus>) => void;
  resetBarStates: () => void;
  setMetrics: (metrics: SortMetrics | null) => void;
  setCurrentStep: (step: number) => void;
  setTotalSteps: (steps: number) => void;
  setCurrentMessage: (msg: string) => void;
  setTeachMode: (enabled: boolean) => void;
  setComparisonAlgorithms: (algorithms: AlgorithmId[]) => void;
  setTheme: (theme: "dark" | "light") => void;
  setReducedMotion: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  reset: () => void;
}

const DEFAULT_SIZE = 32;
const DEFAULT_SPEED = 50;

// Use a deterministic initial array to avoid SSR/client hydration mismatch.
// A random array is generated client-side on mount via VisualizerPanel.
const createInitialState = (): VisualizerState => ({
  array: Array.from({ length: DEFAULT_SIZE }, (_, i) => i + 1),
  barStates: {},
  algorithm: "bubble",
  status: "idle",
  speed: DEFAULT_SPEED,
  arraySize: DEFAULT_SIZE,
  preset: "random",
  metrics: null,
  currentStep: 0,
  totalSteps: 0,
  currentMessage: "",
  teachMode: true,
  comparisonAlgorithms: [],
  theme: "dark",
  reducedMotion: false,
  soundEnabled: true,
});

export const useVisualizerStore = create<VisualizerState & VisualizerActions>(
  (set) => ({
    ...createInitialState(),

    setAlgorithm: (id) => set({ algorithm: id }),
    setArray: (arr) => set({ array: arr, barStates: {} }),
    setArrayOnly: (arr) => set({ array: arr }),
    setArraySize: (size) =>
      set((s) => ({
        arraySize: size,
        array: generateArray(size, s.preset),
        barStates: {},
      })),
    setPreset: (preset) =>
      set((s) => ({
        preset,
        array: generateArray(s.arraySize, preset),
        barStates: {},
      })),
    generateNewArray: () =>
      set((s) => ({
        array: generateArray(s.arraySize, s.preset),
        barStates: {},
        status: "idle",
        metrics: null,
        currentStep: 0,
        totalSteps: 0,
        currentMessage: "",
      })),
    setSpeed: (speed) => set({ speed }),
    setStatus: (status) => set({ status }),
    setBarState: (index, status) =>
      set((s) => ({
        barStates: { ...s.barStates, [index]: status },
      })),
    setBarStates: (states) => set({ barStates: states }),
    resetBarStates: () => set({ barStates: {} }),
    setMetrics: (metrics) => set({ metrics }),
    setCurrentStep: (currentStep) => set({ currentStep }),
    setTotalSteps: (totalSteps) => set({ totalSteps }),
    setCurrentMessage: (currentMessage) => set({ currentMessage }),
    setTeachMode: (teachMode) => set({ teachMode }),
    setComparisonAlgorithms: (comparisonAlgorithms) => set({ comparisonAlgorithms }),
    setTheme: (theme) => set({ theme }),
    setReducedMotion: (reducedMotion) => set({ reducedMotion }),
    setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
    reset: () =>
      set((s) => ({
        ...createInitialState(),
        array: generateArray(s.arraySize, s.preset),
        arraySize: s.arraySize,
        preset: s.preset,
        algorithm: s.algorithm,
        speed: s.speed,
        teachMode: s.teachMode,
        theme: s.theme,
        reducedMotion: s.reducedMotion,
        soundEnabled: s.soundEnabled,
      })),
  })
);
