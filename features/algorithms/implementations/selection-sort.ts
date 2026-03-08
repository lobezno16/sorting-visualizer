import type { OperationWithMessage, SortMetrics } from "../types";
import { createMetrics } from "../engine/utils";

export function selectionSort(
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

  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    push({
      type: "setActive",
      indices: [i],
      message: "Scanning for minimum",
    });

    for (let j = i + 1; j < n; j++) {
      metrics.comparisons++;
      push({
        type: "compare",
        i: minIdx,
        j,
        message: "Comparing with current minimum",
      });

      if (array[j] < array[minIdx]) {
        minIdx = j;
        push({
          type: "setActive",
          indices: [minIdx],
          message: "New minimum found",
        });
      }
    }

    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      metrics.swaps++;
      push({
        type: "swap",
        i,
        j: minIdx,
        message: "Swapping minimum into place",
      });
    }

    push({ type: "markSorted", index: i, message: "Minimum in sorted position" });
  }

  push({ type: "clearActive" });
  push({ type: "markSorted", index: n - 1, message: "Sorted" });

  metrics.endTime = performance.now();
  push({ type: "complete", message: "Sort complete" });

  return { operations, metrics, finalArray: array };
}
