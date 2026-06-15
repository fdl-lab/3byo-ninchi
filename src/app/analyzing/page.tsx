"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import NeonBackground from "@/components/ui/NeonBackground";
import ScanLine from "@/components/ui/ScanLine";
import GlassPanel from "@/components/ui/GlassPanel";
import HudOverlay from "@/components/hud/HudOverlay";
import Equalizer from "@/components/hud/Equalizer";
import Waveform from "@/components/hud/Waveform";
import { FluctuatingNumber } from "@/components/hud/DataCounter";
import GlitchText from "@/components/ui/GlitchText";
import { generateMockAnalysis } from "@/lib/mockAnalysis";
import { getVideoUrl, saveAnalysisResult } from "@/lib/videoStore";

const PHASES = [
  "INITIALIZING NEURAL SCAN...",
  "SCANNING EYE CONTACT",
  "FACE TRACKING",
  "Gaze Vector Analysis",
  "Emotional Resonance Check",
  "TARGET ACQUISITION",
];

export default function AnalyzingPage() {
  const router = useRouter();
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [locked, setLocked] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = getVideoUrl();
    if (!url) {
      router.replace("/upload");
      return;
    }
    setVideoUrl(url);
  }, [router]);

  useEffect(() => {
    const phaseInterval = setInterval(() => {
      setPhase((p) => (p + 1) % PHASES.length);
    }, 1200);

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        return p + Math.random() * 8 + 2;
      });
    }, 200);

    const lockTimer = setTimeout(() => setLocked(true), 3000);
    const doneTimer = setTimeout(() => {
      const result = generateMockAnalysis();
      saveAnalysisResult(result);
      router.push("/result");
    }, 6000);

    return () => {
      clearInterval(phaseInterval);
      clearInterval(progressInterval);
      clearTimeout(lockTimer);
      clearTimeout(doneTimer);
    };
  }, [router]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <NeonBackground />
      <ScanLine />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <motion.div
          className="w-full max-w-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlitchText as="h1" className="text-center block mb-2">
            <span className="hud-font text-3xl sm:text-4xl font-bold neon-text tracking-[0.2em]">
              ANALYZING...
            </span>
          </GlitchText>

          <AnimatePresence mode="wait">
            <motion.p
              key={phase}
              className="text-center hud-font text-xs text-purple-400/80 tracking-[0.3em] h-5"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
            >
              {PHASES[phase]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="relative w-full max-w-md aspect-[4/3] mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <GlassPanel className="relative w-full h-full overflow-hidden">
            {videoUrl ? (
              <video
                src={videoUrl}
                className="w-full h-full object-cover opacity-60"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-900/30 to-indigo-900/20" />
            )}
            <HudOverlay locked={locked} showRec timestamp="00:00.00" />

            {locked && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-20"
                initial={{ scale: 2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <motion.span
                  className="hud-font text-xl sm:text-2xl font-bold text-pink-400 neon-text tracking-[0.3em]"
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(236,72,153,0.5)",
                      "0 0 30px rgba(236,72,153,0.8)",
                      "0 0 10px rgba(236,72,153,0.5)",
                    ],
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  LOCK ON
                </motion.span>
              </motion.div>
            )}
          </GlassPanel>
        </motion.div>

        <div className="w-full max-w-md space-y-4">
          <GlassPanel className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="hud-font text-[10px] text-purple-400/60 tracking-widest">
                SCAN PROGRESS
              </span>
              <span className="hud-font text-sm text-purple-200">
                {Math.min(Math.round(progress), 100)}%
              </span>
            </div>
            <div className="h-1.5 bg-purple-900/40 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </GlassPanel>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "EYE MATCH", min: 60, max: 95 },
              { label: "GAZE DEPTH", min: 40, max: 88 },
              { label: "SYNC RATE", min: 70, max: 99 },
            ].map((stat) => (
              <GlassPanel key={stat.label} className="p-3 text-center">
                <p className="hud-font text-[8px] text-purple-400/50 mb-1 tracking-widest">
                  {stat.label}
                </p>
                <FluctuatingNumber
                  min={stat.min}
                  max={stat.max}
                  suffix="%"
                  className="hud-font text-sm text-purple-200 neon-text"
                />
              </GlassPanel>
            ))}
          </div>

          <GlassPanel className="p-4">
            <Waveform className="h-12" />
            <div className="flex items-center justify-between mt-3">
              <Equalizer bars={20} />
              <motion.span
                className="hud-font text-[9px] text-purple-400/50"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                SIGNAL ACTIVE
              </motion.span>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
