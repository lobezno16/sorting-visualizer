import type { AlgorithmRunResult, OperationWithMessage } from "../types";

export type SortAlgorithm = (
  arr: number[],
  emit: (op: OperationWithMessage) => void
) => AlgorithmRunResult;
