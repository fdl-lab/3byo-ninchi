"use client";

import { motion } from "framer-motion";

interface FilmstripProps {
  highlightIndex?: number;
  timestamp?: string;
}

export default function Filmstrip({
  highlightIndex = 2,
  timestamp = "00:02.17",
}: FilmstripProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className={`relative flex-shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded-sm overflow-hidden border ${
            i === highlightIndex
              ? "border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
              : "border-purple-500/20"
          }`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-pink-900/30"
            style={{
              backgroundImage: `linear-gradient(${i * 30}deg, rgba(99,102,241,0.3), rgba(168,85,247,0.2))`,
            }}
          />
          {i === highlightIndex && (
            <>
              <motion.div
                className="absolute inset-0 border-2 border-purple-400/50"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="absolute bottom-1 left-1 hud-font text-[8px] text-purple-300 bg-black/60 px-1">
                {timestamp}
              </span>
            </>
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="hud-font text-[8px] text-purple-400/40">FRAME {i + 1}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
