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

  // Bug 4 fix: track whether we exited early so we only mark index 0 once.
  let didBreak = false;

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

    if (!swapped) {
      // Bug 4 fix: on early exit, mark the remaining unsorted-region elements
      // (0 .. n-2-i) that the no-swap pass confirmed are already in place.
      for (let k = 0; k < n - 1 - i; k++) {
        push({ type: "markSorted", index: k, message: "Sorted" });
      }
      didBreak = true;
      break;
    }
  }

  // Bug 4 fix: if the loop ran to completion, index 0 is the only element
  // not yet marked (the last pass covers index 1). Mark it exactly once here.
  if (!didBreak) {
    push({ type: "markSorted", index: 0, message: "Sorted" });
  }

  metrics.endTime = performance.now();
  push({ type: "complete", message: "Sort complete" });

  return { operations, metrics, finalArray: array };
}
