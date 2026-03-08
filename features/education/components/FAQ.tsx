"use client";

import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What are sorting algorithms?",
    a: "Sorting algorithms are methods for arranging elements in a specific order (ascending or descending). They're fundamental in computer science and used everywhere from databases to search results.",
  },
  {
    q: "Why does execution time vary from theoretical complexity?",
    a: "Browser runtime, animation overhead, and JavaScript engine optimizations affect measured execution. Theoretical Big-O describes growth rate as input size increases, not absolute wall-clock time.",
  },
  {
    q: "Which algorithm should I use in practice?",
    a: "For general-purpose sorting, Quick Sort or Merge Sort are common. JavaScript's Array.sort() uses Timsort (hybrid of Merge + Insertion). Choose based on stability, memory, and data characteristics.",
  },
  {
    q: "What does stable vs unstable mean?",
    a: "A stable sort preserves the relative order of equal elements. For example, sorting by last name then first name: stable sort keeps first-name order within same last names.",
  },
  {
    q: "Can I use custom array input?",
    a: "The visualizer supports presets (random, nearly sorted, reversed, duplicate-heavy) and array size control. Custom value input can be added as an enhancement.",
  },
];

export function FAQ() {
  return (
    <motion.section
      id="faq"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="scroll-mt-24"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">FAQ</h2>
          <p className="text-muted-foreground mt-1">
            Common questions about sorting algorithms.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </motion.section>
  );
}
