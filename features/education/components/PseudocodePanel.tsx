"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useVisualizerStore } from "@/features/visualizer/store/visualizer-store";
import { ALGORITHM_METADATA } from "@/features/algorithms/metadata";
import { cn } from "@/lib/utils";

export function PseudocodePanel() {
  const { algorithm, currentMessage } = useVisualizerStore();
  const meta = ALGORITHM_METADATA[algorithm];

  return (
    <Card className="bg-card/30 border-border/50">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-medium">What&apos;s happening</h3>
        {currentMessage && (
          <p className="text-sm text-muted-foreground">{currentMessage}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-muted/30 p-3 font-mono text-xs space-y-1">
          {meta.pseudoCode.map((line, i) => (
            <div
              key={i}
              className={cn(
                "px-2 py-0.5 rounded",
                currentMessage && line.toLowerCase().includes(currentMessage.toLowerCase().split(" ")[0])
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground"
              )}
            >
              {line}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
