/**
 * Operation types for the sorting visualization engine.
 * Algorithms emit these operations; the UI consumes them for animation.
 */

export type SortOperation =
  | { type: "compare"; i: number; j: number }
  | { type: "swap"; i: number; j: number }
  | { type: "overwrite"; index: number; value: number }
  | { type: "setPivot"; index: number }
  | { type: "markSorted"; index: number }
  | { type: "setRange"; start: number; end: number }
  | { type: "setHeapBoundary"; index: number }
  | { type: "setMergeSegment"; start: number; end: number }
  | { type: "setActive"; indices: number[] }
  | { type: "clearActive" }
  | { type: "complete" };

export type OperationWithMessage = SortOperation & {
  message?: string;
};

export interface SortMetrics {
  comparisons: number;
  swaps: number;
  writes: number;
  recursionDepth: number;
  startTime: number;
  endTime?: number;
}

export interface AlgorithmRunResult {
  operations: OperationWithMessage[];
  metrics: SortMetrics;
  finalArray: number[];
}
