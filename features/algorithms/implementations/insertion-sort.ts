import type { OperationWithMessage, SortMetrics } from "../types";
import { createMetrics } from "../engine/utils";

export function insertionSort(
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
  push({ type: "markSorted", index: 0, message: "First element is sorted" });

  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;

    push({
      type: "setActive",
      indices: [i],
      message: "Finding position for current element",
    });

    while (j >= 0) {
      metrics.comparisons++;
      push({
        type: "compare",
        i: j,
        j: i,
        message: "Comparing with sorted region",
      });

      if (array[j] <= key) break;

      array[j + 1] = array[j];
      metrics.writes++;
      push({
        type: "overwrite",
        index: j + 1,
        value: array[j],
        message: "Shifting value right to make room",
      });
      j--;
    }

    array[j + 1] = key;
    metrics.writes++;
    push({
      type: "overwrite",
      index: j + 1,
      value: key,
      message: "Inserting element in position",
    });
    push({ type: "markSorted", index: j + 1, message: "Extended sorted region" });
  }

  push({ type: "clearActive" });
  for (let i = 0; i < n; i++) {
    push({ type: "markSorted", index: i, message: "Sorted" });
  }

  metrics.endTime = performance.now();
  push({ type: "complete", message: "Sort complete" });

  return { operations, metrics, finalArray: array };
}
