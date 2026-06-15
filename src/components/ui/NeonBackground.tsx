"use client";

import { motion } from "framer-motion";

export default function NeonBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#030014]" />
      <div className="absolute inset-0 grid-bg opacity-60" />

      <motion.div
        className="absolute -top-1/4 -left-1/4 h-[600px] w-[600px] rounded-full bg-purple-700/20 blur-[120px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] rounded-full bg-pink-600/15 blur-[100px]"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[80px]"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      <svg className="absolute inset-0 h-full w-full opacity-[0.04]">
        <defs>
          <pattern id="hex" width="60" height="52" patternUnits="userSpaceOnUse">
            <path
              d="M30 0 L60 15 L60 37 L30 52 L0 37 L0 15 Z"
              fill="none"
              stroke="purple"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)" />
      </svg>
    </div>
  );
}
