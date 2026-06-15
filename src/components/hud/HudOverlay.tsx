"use client";

import { motion } from "framer-motion";
import CornerBrackets from "../ui/CornerBrackets";
import Equalizer from "./Equalizer";

interface HudOverlayProps {
  locked?: boolean;
  showRec?: boolean;
  timestamp?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function HudOverlay({
  locked = true,
  showRec = true,
  timestamp = "00:02.17",
  title = "視線一致",
  subtitle = "その瞬間、確かに届いた。",
  className = "",
}: HudOverlayProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {showRec && (
        <motion.div
          className="absolute top-3 left-3 flex items-center gap-2 z-10"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          <span className="hud-font text-[10px] text-red-400 tracking-wider">REC</span>
          <span className="hud-font text-[10px] text-purple-300/70">{timestamp}</span>
        </motion.div>
      )}

      <div className="absolute top-3 right-3 z-10">
        <motion.div
          className="hud-font text-[10px] px-2 py-1 border border-purple-500/40 text-purple-300 bg-black/40"
          animate={locked ? { borderColor: ["rgba(168,85,247,0.4)", "rgba(236,72,153,0.6)", "rgba(168,85,247,0.4)"] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {locked ? "TARGET LOCKED" : "SCANNING..."}
        </motion.div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          animate={locked ? { scale: [1, 1.02, 1] } : { rotate: [0, 360] }}
          transition={
            locked
              ? { duration: 2, repeat: Infinity }
              : { duration: 4, repeat: Infinity, ease: "linear" }
          }
        >
          <div className="relative w-32 h-40 sm:w-40 sm:h-48">
            <CornerBrackets size="lg" />
            <motion.div
              className="absolute inset-4 border border-purple-400/30 rounded-full"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-8 border border-dashed border-pink-400/40 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="h-1 w-1 bg-purple-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,1)]"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-16 left-4 right-4 z-10">
        <motion.p
          className="text-2xl sm:text-3xl font-bold text-white neon-text"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {title}
        </motion.p>
        <motion.p
          className="text-xs sm:text-sm text-purple-300/80 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {subtitle}
        </motion.p>
      </div>

      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10">
        <Equalizer bars={8} className="opacity-70" />
        <motion.span
          className="hud-font text-[9px] text-purple-400/60 tracking-widest"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          FACE TRACKING ACTIVE
        </motion.span>
      </div>

      <motion.div
        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400/80 to-transparent"
        animate={{ top: ["10%", "90%", "10%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
