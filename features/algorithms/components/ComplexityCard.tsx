"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { AlgorithmMetadata } from "../types";
import { cn } from "@/lib/utils";

interface ComplexityCardProps {
  algorithm: AlgorithmMetadata;
  index?: number;
}

export function ComplexityCard({ algorithm, index = 0 }: ComplexityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="bg-card/50 border-border/50 overflow-hidden hover:border-primary/20 transition-colors">
        <Accordion type="single" collapsible>
          <AccordionItem value="complexity" className="border-none">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex flex-col items-start text-left">
                <span className="font-semibold">{algorithm.name}</span>
                <span className="text-xs text-muted-foreground mt-1">
                  Best: {algorithm.bestCase} · Worst: {algorithm.worstCase}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-0">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {algorithm.description}
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Best:</span>{" "}
                    <code className="bg-muted px-1 rounded">{algorithm.bestCase}</code>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Average:</span>{" "}
                    <code className="bg-muted px-1 rounded">{algorithm.averageCase}</code>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Worst:</span>{" "}
                    <code className="bg-muted px-1 rounded">{algorithm.worstCase}</code>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Space:</span>{" "}
                    <code className="bg-muted px-1 rounded">{algorithm.spaceComplexity}</code>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded",
                      algorithm.stable ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"
                    )}
                  >
                    {algorithm.stable ? "Stable" : "Unstable"}
                  </span>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded",
                      algorithm.inPlace ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"
                    )}
                  >
                    {algorithm.inPlace ? "In-place" : "Extra space"}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Use case:</span>
                  <p className="text-sm mt-1">{algorithm.useCase}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Pros</span>
                    <ul className="text-sm mt-1 list-disc list-inside">
                      {algorithm.pros.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Cons</span>
                    <ul className="text-sm mt-1 list-disc list-inside">
                      {algorithm.cons.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </motion.div>
  );
}
