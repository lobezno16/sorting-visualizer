"use client";

import { motion } from "motion/react";
import { ComplexityCard } from "./ComplexityCard";
import { ALGORITHM_METADATA } from "../metadata";
import type { AlgorithmId } from "../types";

const ALGORITHM_IDS: AlgorithmId[] = [
  "bubble",
  "insertion",
  "selection",
  "quick",
  "merge",
  "heap",
];

export function ComplexityOverview() {
  return (
    <motion.section
      id="complexity"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="scroll-mt-24"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Complexity Overview</h2>
          <p className="text-muted-foreground mt-1">
            Theoretical complexity and characteristics of each algorithm.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ALGORITHM_IDS.map((id, i) => (
            <ComplexityCard
              key={id}
              algorithm={ALGORITHM_METADATA[id]}
              index={i}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
