"use client";

import { motion } from "framer-motion";

interface EqualizerProps {
  bars?: number;
  className?: string;
  color?: string;
}

export default function Equalizer({
  bars = 12,
  className = "",
  color = "bg-purple-500",
}: EqualizerProps) {
  return (
    <div className={`flex items-end gap-[3px] h-8 ${className}`}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className={`w-1 rounded-sm ${color}`}
          animate={{ height: ["20%", `${30 + Math.random() * 70}%`, "20%"] }}
          transition={{
            duration: 0.4 + Math.random() * 0.6,
            repeat: Infinity,
            delay: i * 0.05,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
