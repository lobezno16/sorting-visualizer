import type { OperationWithMessage, SortMetrics } from "../types";
import { createMetrics } from "../engine/utils";

export function quickSort(
  arr: number[],
  emit: (op: OperationWithMessage) => void
): { operations: OperationWithMessage[]; metrics: SortMetrics; finalArray: number[] } {
  const array = [...arr];
  const metrics = createMetrics();
  const operations: OperationWithMessage[] = [];

  const push = (op: OperationWithMessage) => {
    operations.push(op);
    emit(op);
  };

  function partition(low: number, high: number): number {
    const pivot = array[high];
    push({
      type: "setPivot",
      index: high,
      message: "Choosing pivot (last element)",
    });

    let i = low - 1;
    for (let j = low; j < high; j++) {
      metrics.comparisons++;
      push({
        type: "compare",
        i: j,
        j: high,
        message: "Comparing with pivot",
      });

      if (array[j] <= pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        if (i !== j) {
          metrics.swaps++;
          push({
            type: "swap",
            i,
            j,
            message: "Moving smaller element left",
          });
        }
      }
    }

    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    metrics.swaps++;
    push({
      type: "swap",
      i: i + 1,
      j: high,
      message: "Placing pivot in final position",
    });
    return i + 1;
  }

  function sort(low: number, high: number) {
    if (low < high) {
      metrics.recursionDepth = Math.max(
        metrics.recursionDepth,
        Math.ceil(Math.log2(high - low + 1))
      );
      push({
        type: "setRange",
        start: low,
        end: high,
        message: "Partitioning range",
      });

      const pivotIdx = partition(low, high);
      push({ type: "markSorted", index: pivotIdx, message: "Pivot in place" });

      sort(low, pivotIdx - 1);
      sort(pivotIdx + 1, high);
    }
  }

  push({
    type: "setRange",
    start: 0,
    end: array.length - 1,
    message: "Starting Quick Sort",
  });
  sort(0, array.length - 1);

  for (let i = 0; i < array.length; i++) {
    push({ type: "markSorted", index: i, message: "Sorted" });
  }

  metrics.endTime = performance.now();
  push({ type: "complete", message: "Sort complete" });

  return { operations, metrics, finalArray: array };
}
