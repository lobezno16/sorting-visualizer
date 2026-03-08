import type { OperationWithMessage, SortMetrics } from "../types";
import { createMetrics } from "../engine/utils";

export function mergeSort(
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

  function merge(left: number, mid: number, right: number) {
    push({
      type: "setMergeSegment",
      start: left,
      end: right,
      message: "Merging two sorted halves",
    });

    const leftArr = array.slice(left, mid + 1);
    const rightArr = array.slice(mid + 1, right + 1);
    let i = 0,
      j = 0,
      k = left;

    while (i < leftArr.length && j < rightArr.length) {
      metrics.comparisons++;
      push({
        type: "compare",
        i: left + i,
        j: mid + 1 + j,
        message: "Comparing merge candidates",
      });

      if (leftArr[i] <= rightArr[j]) {
        array[k] = leftArr[i];
        metrics.writes++;
        push({
          type: "overwrite",
          index: k,
          value: leftArr[i],
          message: "Taking from left half",
        });
        i++;
      } else {
        array[k] = rightArr[j];
        metrics.writes++;
        push({
          type: "overwrite",
          index: k,
          value: rightArr[j],
          message: "Taking from right half",
        });
        j++;
      }
      k++;
    }

    while (i < leftArr.length) {
      array[k] = leftArr[i];
      metrics.writes++;
      push({
        type: "overwrite",
        index: k,
        value: leftArr[i],
        message: "Copying remaining from left",
      });
      i++;
      k++;
    }

    while (j < rightArr.length) {
      array[k] = rightArr[j];
      metrics.writes++;
      push({
        type: "overwrite",
        index: k,
        value: rightArr[j],
        message: "Copying remaining from right",
      });
      j++;
      k++;
    }
  }

  function sort(left: number, right: number) {
    if (left < right) {
      metrics.recursionDepth = Math.max(
        metrics.recursionDepth,
        Math.ceil(Math.log2(right - left + 1))
      );
      const mid = Math.floor((left + right) / 2);

      push({
        type: "setRange",
        start: left,
        end: mid,
        message: "Sorting left half",
      });
      sort(left, mid);

      push({
        type: "setRange",
        start: mid + 1,
        end: right,
        message: "Sorting right half",
      });
      sort(mid + 1, right);

      merge(left, mid, right);
    }
  }

  push({
    type: "setRange",
    start: 0,
    end: array.length - 1,
    message: "Starting Merge Sort",
  });
  sort(0, array.length - 1);

  for (let i = 0; i < array.length; i++) {
    push({ type: "markSorted", index: i, message: "Sorted" });
  }

  metrics.endTime = performance.now();
  push({ type: "complete", message: "Sort complete" });

  return { operations, metrics, finalArray: array };
}
