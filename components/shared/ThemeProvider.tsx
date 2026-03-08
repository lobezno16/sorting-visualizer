"use client";

import { useEffect } from "react";
import { useVisualizerStore } from "@/features/visualizer/store/visualizer-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useVisualizerStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}
