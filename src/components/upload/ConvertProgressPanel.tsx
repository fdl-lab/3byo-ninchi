"use client";

import { motion } from "framer-motion";
import { ConvertProgress } from "@/lib/videoConvert";
import GlassPanel from "@/components/ui/GlassPanel";

interface ConvertProgressPanelProps {
  progress: ConvertProgress;
}

export default function ConvertProgressPanel({ progress }: ConvertProgressPanelProps) {
  return (
    <GlassPanel className="p-6 w-full">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="w-16 h-16 rounded-full border-2 border-purple-500/40 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <span className="hud-font text-[10px] text-purple-300">HEVC</span>
        </motion.div>

        <div className="text-center w-full">
          <p className="hud-font text-xs text-purple-200 tracking-[0.2em] mb-1">
            {progress.stage === "loading" ? "ENGINE LOAD" : "FORMAT CONVERT"}
          </p>
          <p className="text-sm text-purple-300/80">{progress.message}</p>
        </div>

        <div className="w-full">
          <div className="flex justify-between mb-2">
            <span className="hud-font text-[9px] text-purple-400/50 tracking-widest">
              MP4 CONVERSION
            </span>
            <span className="hud-font text-xs text-purple-200">{progress.progress}%</span>
          </div>
          <div className="h-2 bg-purple-900/40 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress.progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <p className="text-[10px] text-purple-400/40 text-center leading-relaxed">
          iPhone HEVC / MOV を H.264 MP4 に変換しています
          <br />
          初回は数十秒かかることがあります
        </p>
      </div>
    </GlassPanel>
  );
}
