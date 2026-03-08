"use client";

import { motion } from "motion/react";
import { HeroScene3D } from "./HeroScene3D";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      <HeroScene3D />
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
        >
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Sorting Algorithms
          </span>
          <br />
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Visualized
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Step-by-step visualization of Bubble, Insertion, Selection, Quick,
          Merge, and Heap Sort. Compare algorithms, explore complexity, and
          learn how sorting works.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Button asChild size="lg" variant="glow">
            <a href="#visualizer">Start Visualizing</a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#comparison">Compare Algorithms</a>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <a href="#learn">Learn More</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
