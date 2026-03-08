export type { SortOperation, OperationWithMessage, SortMetrics, AlgorithmRunResult } from "./operations";

export type AlgorithmId =
  | "bubble"
  | "insertion"
  | "selection"
  | "quick"
  | "merge"
  | "heap";

export interface AlgorithmMetadata {
  id: AlgorithmId;
  name: string;
  description: string;
  bestCase: string;
  averageCase: string;
  worstCase: string;
  spaceComplexity: string;
  stable: boolean;
  inPlace: boolean;
  pros: string[];
  cons: string[];
  useCase: string;
  pseudoCode: string[];
}
