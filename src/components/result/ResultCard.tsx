"use client";

import { motion } from "framer-motion";
import GlassPanel from "../ui/GlassPanel";
import { ReactNode } from "react";

interface ResultCardProps {
  label: string;
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function ResultCard({
  label,
  children,
  className = "",
  delay = 0,
}: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <GlassPanel className={`p-4 ${className}`}>
        <p className="hud-font text-[9px] uppercase tracking-[0.2em] text-purple-400/60 mb-2">
          {label}
        </p>
        {children}
      </GlassPanel>
    </motion.div>
  );
}
