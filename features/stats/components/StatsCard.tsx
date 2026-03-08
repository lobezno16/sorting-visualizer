"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  className?: string;
  delay?: number;
}

export function StatsCard({ title, value, icon: Icon, className, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card
        className={cn(
          "bg-card/50 border-border/50 backdrop-blur-sm overflow-hidden",
          className
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <span className="text-sm font-medium text-muted-foreground">
            {title}
          </span>
          {Icon && <Icon className="h-4 w-4 text-primary/60" />}
        </CardHeader>
        <CardContent>
          <motion.span
            key={value}
            initial={{ scale: 0.9, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-bold tabular-nums"
          >
            {value}
          </motion.span>
        </CardContent>
      </Card>
    </motion.div>
  );
}
