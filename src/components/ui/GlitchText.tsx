"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlitchTextProps {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "span" | "p";
}

export default function GlitchText({
  children,
  className = "",
  as: Tag = "span",
}: GlitchTextProps) {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      animate={{ x: [0, -1, 1, 0, 0] }}
      transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
    >
      <Tag className="relative z-10">{children}</Tag>
      <Tag
        className="absolute inset-0 text-pink-500/30 select-none pointer-events-none"
        aria-hidden
        style={{ clipPath: "inset(40% 0 30% 0)" }}
      >
        {children}
      </Tag>
      <Tag
        className="absolute inset-0 text-cyan-400/20 select-none pointer-events-none"
        aria-hidden
        style={{ clipPath: "inset(60% 0 10% 0)" }}
      >
        {children}
      </Tag>
    </motion.div>
  );
}
