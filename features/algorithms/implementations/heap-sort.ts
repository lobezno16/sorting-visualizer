import type { OperationWithMessage, SortMetrics } from "../types";
import { createMetrics } from "../engine/utils";

export function heapSort(
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

  function heapify(i: number, heapSize: number) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < heapSize) {
      metrics.comparisons++;
      push({
        type: "compare",
        i: largest,
        j: left,
        message: "Comparing with left child",
      });
      if (array[left] > array[largest]) largest = left;
    }

    if (right < heapSize) {
      metrics.comparisons++;
      push({
        type: "compare",
        i: largest,
        j: right,
        message: "Comparing with right child",
      });
      if (array[right] > array[largest]) largest = right;
    }

    if (largest !== i) {
      [array[i], array[largest]] = [array[largest], array[i]];
      metrics.swaps++;
      push({
        type: "swap",
        i,
        j: largest,
        message: "Restoring heap property",
      });
      push({
        type: "setHeapBoundary",
        index: heapSize - 1,
        message: "Heap boundary",
      });
      heapify(largest, heapSize);
    }
  }

  push({
    type: "setRange",
    start: 0,
    end: n - 1,
    message: "Building max-heap",
  });

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    push({
      type: "setHeapBoundary",
      index: n - 1,
      message: "Heapifying from bottom up",
    });
    heapify(i, n);
  }

  for (let i = n - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    metrics.swaps++;
    push({
      type: "swap",
      i: 0,
      j: i,
      message: "Moving max to sorted region",
    });
    push({
      type: "setHeapBoundary",
      index: i - 1,
      message: "Shrinking heap",
    });
    push({ type: "markSorted", index: i, message: "Largest in place" });
    heapify(0, i);
  }

  push({ type: "markSorted", index: 0, message: "Sorted" });

  metrics.endTime = performance.now();
  push({ type: "complete", message: "Sort complete" });

  return { operations, metrics, finalArray: array };
}
