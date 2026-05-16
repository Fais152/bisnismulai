"use client";

import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex flex-col mb-2 px-2 items-start">
      <span className="text-[11px] font-bold mb-0.5 text-[#000080]">BizBot AI</span>
      <div className="win-inset px-3 py-2 text-[13px] bg-[#FFFFFF] text-[#000000] flex items-center gap-1.5 h-8">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 bg-[#808080]"
            animate={{ y: [0, -3, 0] }}
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
