"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useVisualizerStore } from "@/features/visualizer/store/visualizer-store";
import { ALGORITHM_METADATA } from "@/features/algorithms/metadata";
import { BookOpen, MessageSquare, Footprints } from "lucide-react";

// Map operation messages to pseudocode line keywords for highlighting
const OP_TO_LINE_KEYWORDS: Record<string, string[]> = {
  // Bubble Sort
  "Comparing adjacent": ["compare", "if arr"],
  "Swapping": ["swap"],
  "Largest of pass": ["for i"],
  // Insertion Sort
  "Finding position": ["key = arr", "for i"],
  "Comparing with sorted": ["while", "compare"],
  "Shifting value": ["arr[j+1] = arr[j]"],
  "Inserting element": ["arr[j+1] = key"],
  "Extended sorted": ["for i"],
  // Selection Sort
  "Found new minimum": ["minIdx = j", "if arr[j]"],
  "Placing minimum": ["swap(arr[i]"],
  // Quick Sort
  "pivot": ["pivot"],
  "Partitioning": ["partition", "for j"],
  "Comparing with pivot": ["if arr[j]", "compare"],
  // Merge Sort
  "Dividing": ["mergeSort", "mid ="],
  "Merging": ["merge("],
  "Copying": ["copy"],
  // Heap Sort
  "Building heap": ["buildMaxHeap"],
  "Extracting max": ["swap(arr[0]"],
  "Heapifying": ["heapify"],
  // Shared
  "Sorted": ["markSorted", "for i"],
  "Sort complete": ["complete"],
};

function getHighlightedLines(message: string, pseudoCode: string[]): Set<number> {
  const highlighted = new Set<number>();
  if (!message) return highlighted;

  const msgLower = message.toLowerCase();
  for (const [keyword, lineKeywords] of Object.entries(OP_TO_LINE_KEYWORDS)) {
    if (msgLower.includes(keyword.toLowerCase())) {
      for (let i = 0; i < pseudoCode.length; i++) {
        const lineLower = pseudoCode[i].toLowerCase();
        for (const lk of lineKeywords) {
          if (lineLower.includes(lk.toLowerCase())) {
            highlighted.add(i);
          }
        }
      }
    }
  }

  return highlighted;
}

export function PseudocodePanel() {
  const { algorithm, currentMessage, currentStep, totalSteps, status } =
    useVisualizerStore();
  const meta = ALGORITHM_METADATA[algorithm];
  const highlighted = getHighlightedLines(currentMessage, meta.pseudoCode);

  return (
    <Card className="bg-card/30 border-border/50">
      <CardHeader className="pb-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Teach Mode — {meta.name}</h3>
          </div>
          {totalSteps > 0 && (
            <span className="text-xs text-muted-foreground">
              <Footprints className="inline h-3 w-3 mr-1" />
              Step {currentStep} / {totalSteps}
            </span>
          )}
        </div>
        {currentMessage && status !== "idle" && (
          <div className="flex items-start gap-2 rounded-md bg-primary/10 border border-primary/20 px-3 py-2">
            <MessageSquare className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-primary">{currentMessage}</p>
          </div>
        )}
        {status === "idle" && (
          <p className="text-xs text-muted-foreground">
            Click Start to see step-by-step explanations here.
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-muted/30 p-3 font-mono text-xs space-y-0.5 overflow-x-auto">
          {meta.pseudoCode.map((line, i) => (
            <div
              key={i}
              className={`flex gap-3 px-2 py-0.5 rounded transition-colors duration-200 ${highlighted.has(i)
                  ? "bg-primary/20 text-primary font-semibold"
                  : "text-muted-foreground"
                }`}
            >
              <span className="text-muted-foreground/40 select-none w-4 text-right shrink-0">
                {i + 1}
              </span>
              <span>{line}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
