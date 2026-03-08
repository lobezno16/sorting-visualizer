"use client";

import { useEffect, useState } from "react";

function FloatingBar({
  delay,
  scale,
  x,
}: {
  delay: number;
  scale: number;
  x: number;
}) {
  return (
    <div
      className="absolute rounded-sm bg-primary/40 backdrop-blur-sm animate-float"
      style={{
        left: `${x}%`,
        width: "8px",
        height: `${scale * 80}px`,
        animationDelay: `${delay}s`,
        bottom: "10%",
      }}
    />
  );
}

export function HeroScene3D() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const bars = Array.from({ length: 16 }, (_, i) => ({
    delay: Math.random() * 2,
    scale: 0.4 + Math.random() * 0.8,
    x: (i / 15) * 90 + 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,hsl(var(--primary)/0.15),transparent_70%)]" />
      {bars.map((bar, i) => (
        <FloatingBar key={i} {...bar} />
      ))}
    </div>
  );
}
