"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, StepForward, Volume2, VolumeX } from "lucide-react";
import { useVisualizerStore } from "../store/visualizer-store";
import { useSortRunner } from "../hooks/use-sort-runner";

export function ControlDock() {
  const { run, pause, resume, reset, status } = useSortRunner();
  const { speed, setSpeed, soundEnabled, setSoundEnabled } = useVisualizerStore();

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        {status === "paused" ? (
          <Button
            variant="default"
            size="sm"
            onClick={resume}
            aria-label="Resume sorting"
          >
            <StepForward className="h-4 w-4" />
            Resume
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={run}
            disabled={status === "running" || status === "complete"}
            aria-label="Start sorting"
          >
            <Play className="h-4 w-4" />
            Start
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={pause}
          disabled={status !== "running"}
          aria-label="Pause sorting"
        >
          <Pause className="h-4 w-4" />
          Pause
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={reset}
          aria-label="Reset"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSoundEnabled(!soundEnabled)}
          aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
          className={soundEnabled ? "text-primary hover:text-primary/80" : "text-muted-foreground"}
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex items-center gap-3 min-w-[180px]">
        <span className="text-sm text-muted-foreground">Speed</span>
        <Slider
          value={[speed]}
          onValueChange={([v]) => setSpeed(v)}
          min={10}
          max={100}
          step={5}
          disabled={false}
          className="flex-1"
          aria-label="Animation speed"
        />
      </div>
    </div>
  );
}
