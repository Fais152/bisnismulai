"use client";

import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-4 py-2">
      <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
        B
      </div>
      <div className="flex items-center gap-1.5 bg-card border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-muted-foreground/60"
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 0.7,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
