"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ALGORITHM_METADATA } from "@/features/algorithms/metadata";
import type { AlgorithmId } from "@/features/algorithms/types";

const ALGORITHM_IDS: AlgorithmId[] = [
  "bubble",
  "insertion",
  "selection",
  "quick",
  "merge",
  "heap",
];

export function EducationalGuide() {
  return (
    <motion.section
      id="learn"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="scroll-mt-24"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">How It Works</h2>
          <p className="text-muted-foreground mt-1">
            Understand each algorithm with step-by-step explanations.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {ALGORITHM_IDS.map((id, i) => {
            const meta = ALGORITHM_METADATA[id];
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="bg-card/50 border-border/50 h-full">
                  <CardHeader>
                    <h3 className="font-semibold">{meta.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {meta.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md bg-muted/30 p-3 font-mono text-xs overflow-x-auto">
                      {meta.pseudoCode.map((line, j) => (
                        <div key={j} className="flex gap-3">
                          <span className="text-muted-foreground/40 select-none w-4 text-right shrink-0">
                            {j + 1}
                          </span>
                          <span
                            className={
                              line.trimStart().startsWith("function")
                                ? "text-purple-400"
                                : line.trimStart().startsWith("if") ||
                                  line.trimStart().startsWith("while") ||
                                  line.trimStart().startsWith("for") ||
                                  line.trimStart().startsWith("else")
                                  ? "text-blue-400"
                                  : line.trimStart().startsWith("return")
                                    ? "text-yellow-400"
                                    : "text-muted-foreground"
                            }
                          >
                            {line}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
