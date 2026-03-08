import type { OperationWithMessage, SortMetrics } from "../types";
import { createMetrics } from "../engine/utils";

export function bubbleSort(
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
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      metrics.comparisons++;
      push({
        type: "compare",
        i: j,
        j: j + 1,
        message: "Comparing adjacent values",
      });

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        metrics.swaps++;
        push({
          type: "swap",
          i: j,
          j: j + 1,
          message: "Swapping - wrong order",
        });
        swapped = true;
      }
    }
    push({
      type: "markSorted",
      index: n - 1 - i,
      message: "Largest of pass in place",
    });
    if (!swapped) break;
  }

  for (let i = 0; i < n; i++) {
    push({ type: "markSorted", index: i, message: "Sorted" });
  }

  metrics.endTime = performance.now();
  push({ type: "complete", message: "Sort complete" });

  return { operations, metrics, finalArray: array };
}
