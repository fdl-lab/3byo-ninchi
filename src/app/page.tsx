"use client";

import { motion } from "framer-motion";
import NeonBackground from "@/components/ui/NeonBackground";
import ScanLine from "@/components/ui/ScanLine";
import NeonButton from "@/components/ui/NeonButton";
import PixelLogo from "@/components/ui/PixelLogo";
import CornerBrackets from "@/components/ui/CornerBrackets";
import GlassPanel from "@/components/ui/GlassPanel";
import Equalizer from "@/components/hud/Equalizer";

const HUD_STATS = [
  { label: "SYSTEM", value: "ONLINE" },
  { label: "MODE", value: "EMOTIONAL SCAN" },
  { label: "VERSION", value: "v3.0.1" },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <NeonBackground />
      <ScanLine />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-4 py-4 sm:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hud-font text-[10px] tracking-[0.3em] text-purple-400/60"
          >
            EYE MEMORY ARCHIVE
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-green-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="hud-font text-[10px] text-green-400/80 tracking-wider">
              SYSTEM READY
            </span>
          </motion.div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-4 pb-16 pt-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative mb-8"
          >
            <div className="relative px-8 py-6">
              <CornerBrackets size="lg" />
              <PixelLogo size="hero" />
            </div>
          </motion.div>

          <motion.p
            className="max-w-md text-center text-sm sm:text-base text-purple-200/70 leading-relaxed mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            推しの視線を、未来の装置で記録する。
          </motion.p>
          <motion.p
            className="max-w-sm text-center text-xs text-purple-400/50 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            「目が合った気がした」——その感情を、永遠にアーカイブ。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <NeonButton href="/upload">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Video
            </NeonButton>
          </motion.div>

          <motion.div
            className="mt-16 grid grid-cols-3 gap-3 w-full max-w-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {HUD_STATS.map((stat, i) => (
              <GlassPanel key={stat.label} className="p-3 text-center">
                <p className="hud-font text-[8px] text-purple-400/50 tracking-widest mb-1">
                  {stat.label}
                </p>
                <motion.p
                  className="hud-font text-[10px] sm:text-xs text-purple-200"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                >
                  {stat.value}
                </motion.p>
              </GlassPanel>
            ))}
          </motion.div>

          <motion.div
            className="mt-8 flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <Equalizer bars={16} />
            <span className="hud-font text-[9px] text-purple-400/40 tracking-[0.3em]">
              EMOTIONAL ANALYZER STANDBY
            </span>
          </motion.div>
        </main>

        <footer className="px-4 py-4 text-center">
          <p className="hud-font text-[8px] text-purple-500/30 tracking-[0.3em]">
            © 2026 EYE MEMORY ARCHIVE — FOR OSHIKATSU USE ONLY
          </p>
        </footer>
      </div>
    </div>
  );
}
