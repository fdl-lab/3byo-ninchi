"use client";

import { motion } from "framer-motion";

export default function ScanLine() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent"
        animate={{ y: ["-10%", "110vh"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(168,85,247,0.3) 2px, rgba(168,85,247,0.3) 4px)",
        }}
      />
    </div>
  );
}
