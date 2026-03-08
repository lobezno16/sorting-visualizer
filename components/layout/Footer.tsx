"use client";

import { BarChart3 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-24">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <span className="font-semibold">SortViz</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Sorting Algorithm Visualizer · Built with Next.js, Motion, React Three Fiber
          </p>
        </div>
      </div>
    </footer>
  );
}
