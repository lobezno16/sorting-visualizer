"use client";

import { motion } from "motion/react";
import { BarChart3 } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#hero", label: "Home" },
  { href: "#visualizer", label: "Visualizer" },
  { href: "#complexity", label: "Complexity" },
  { href: "#comparison", label: "Compare" },
  { href: "#analytics", label: "Analytics" },
  { href: "#learn", label: "Learn" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-primary/20 bg-black/50 backdrop-blur-2xl shadow-[0_4px_30px_-10px_rgba(180,90,255,0.2)]"
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#hero"
          className="flex items-center gap-2 font-semibold text-foreground"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 shadow-[0_0_15px_-3px_rgba(180,90,255,0.5)] border border-primary/50">
            <BarChart3 className="h-5 w-5 text-primary drop-shadow-[0_0_5px_rgba(180,90,255,0.8)]" />
          </div>
          <span className="hidden sm:inline">SortViz</span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md hover:bg-white/5"
              )}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm">
            <a href="#visualizer">Start</a>
          </Button>
          <Button asChild variant="glow" size="sm">
            <a href="#comparison">Compare</a>
          </Button>
        </div>
      </nav>
    </motion.header>
  );
}
