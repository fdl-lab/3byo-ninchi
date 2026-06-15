"use client";

import { motion } from "framer-motion";
import { VideoFrame } from "@/lib/videoFrames";

interface FilmstripProps {
  frames: VideoFrame[];
  highlightIndex?: number;
  isPortrait?: boolean;
}

export default function Filmstrip({
  frames,
  highlightIndex = 2,
  isPortrait = false,
}: FilmstripProps) {
  if (frames.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <motion.p
          className="hud-font text-[10px] text-purple-400/50 tracking-widest"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          EXTRACTING FRAMES...
        </motion.p>
      </div>
    );
  }

  const thumbClass = isPortrait
    ? "w-14 h-20 sm:w-16 sm:h-24"
    : "w-20 h-14 sm:w-24 sm:h-16";

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {frames.map((frame, i) => (
        <motion.div
          key={`${frame.timeSec}-${i}`}
          className={`relative flex-shrink-0 ${thumbClass} rounded-sm overflow-hidden border ${
            i === highlightIndex
              ? "border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
              : "border-purple-500/20"
          }`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.08 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={frame.dataUrl}
            alt={`視線フレーム ${frame.timestamp}`}
            className="w-full h-full object-cover"
          />

          {i === highlightIndex && (
            <>
              <motion.div
                className="absolute inset-0 border-2 border-purple-400/50 pointer-events-none"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="absolute bottom-0.5 left-0.5 hud-font text-[7px] text-purple-100 bg-black/70 px-1 rounded-sm">
                {frame.timestamp}
              </span>
              <span className="absolute top-0.5 right-0.5 hud-font text-[6px] text-pink-300 bg-pink-500/30 px-1">
                LOCK
              </span>
            </>
          )}
        </motion.div>
      ))}
    </div>
  );
}
