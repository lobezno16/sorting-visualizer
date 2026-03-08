import type { AlgorithmId } from "../types";
import type { SortAlgorithm } from "../engine/types";
import { bubbleSort } from "./bubble-sort";
import { insertionSort } from "./insertion-sort";
import { selectionSort } from "./selection-sort";
import { quickSort } from "./quick-sort";
import { mergeSort } from "./merge-sort";
import { heapSort } from "./heap-sort";

export const ALGORITHMS: Record<AlgorithmId, SortAlgorithm> = {
  bubble: bubbleSort,
  insertion: insertionSort,
  selection: selectionSort,
  quick: quickSort,
  merge: mergeSort,
  heap: heapSort,
};
