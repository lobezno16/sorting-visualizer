import type { SortMetrics } from "../types";

export function createMetrics(): SortMetrics {
  return {
    comparisons: 0,
    swaps: 0,
    writes: 0,
    recursionDepth: 0,
    startTime: performance.now(),
  };
}

