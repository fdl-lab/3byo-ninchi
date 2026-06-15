"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import NeonBackground from "@/components/ui/NeonBackground";
import ScanLine from "@/components/ui/ScanLine";
import GlassPanel from "@/components/ui/GlassPanel";
import NeonButton from "@/components/ui/NeonButton";
import HudOverlay from "@/components/hud/HudOverlay";
import RadarCircle from "@/components/hud/RadarCircle";
import Equalizer from "@/components/hud/Equalizer";
import DataCounter from "@/components/hud/DataCounter";
import ResultCard from "@/components/result/ResultCard";
import Filmstrip from "@/components/result/Filmstrip";
import TrendGraph from "@/components/result/TrendGraph";
import GlitchText from "@/components/ui/GlitchText";
import { AnalysisResult } from "@/lib/mockAnalysis";
import { getAnalysisResult, getVideoUrl } from "@/lib/videoStore";

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const data = getAnalysisResult<AnalysisResult>();
    const url = getVideoUrl();
    if (!data) {
      router.replace("/upload");
      return;
    }
    setResult(data);
    setVideoUrl(url);
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="hud-font text-purple-400 tracking-widest"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          LOADING ARCHIVE...
        </motion.div>
      </div>
    );
  }

  const levelColors = {
    HIGH: "text-pink-400",
    MID: "text-purple-400",
    LOW: "text-indigo-400",
  };

  return (
    <div className="relative min-h-screen overflow-hidden pb-12">
      <NeonBackground />
      <ScanLine />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-6 sm:py-10">
        <motion.header
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <GlitchText as="h1">
              <span className="text-2xl sm:text-3xl font-black neon-text">解析結果</span>
            </GlitchText>
            <p className="hud-font text-[10px] text-purple-400/50 tracking-[0.3em] mt-1">
              EYE CONTACT ANALYSIS COMPLETE
            </p>
          </div>
          <motion.div
            className="hud-font text-xs px-4 py-2 border border-pink-500/40 text-pink-300 bg-pink-500/10 inline-flex self-start"
            animate={{
              boxShadow: [
                "0 0 10px rgba(236,72,153,0.2)",
                "0 0 25px rgba(236,72,153,0.4)",
                "0 0 10px rgba(236,72,153,0.2)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {result.status}
          </motion.div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassPanel className="relative aspect-[4/3] sm:aspect-video overflow-hidden">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-pink-900/20" />
              )}
              <HudOverlay
                locked
                timestamp={result.timestamp}
                title="視線一致"
                subtitle="その瞬間、確かに届いた。"
              />

              <div className="absolute bottom-3 left-3 z-10 space-y-0.5">
                <p className="hud-font text-[8px] text-purple-400/50">DATE</p>
                <p className="text-[10px] text-purple-200">{result.date}</p>
                <p className="hud-font text-[8px] text-purple-400/50 mt-1">EVENT</p>
                <p className="text-[10px] text-purple-200">{result.event}</p>
                <p className="hud-font text-[8px] text-purple-400/50 mt-1">PLACE</p>
                <p className="text-[10px] text-purple-200">{result.place}</p>
              </div>
            </GlassPanel>
          </motion.div>

          <div className="lg:col-span-2 space-y-4">
            <ResultCard label="Eye Contact Probability" delay={0.3}>
              <div className="flex items-end gap-2">
                <span className="hud-font text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 neon-text">
                  <DataCounter value={result.eyeContactRate} suffix="%" decimals={1} />
                </span>
              </div>
              <Equalizer bars={16} className="mt-3" />
              <motion.p
                className="hud-font text-[10px] text-pink-400/70 mt-2 tracking-widest"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                EYE CONTACT DETECTED
              </motion.p>
            </ResultCard>

            <div className="grid grid-cols-2 gap-3">
              <ResultCard label="Duration" delay={0.4}>
                <p className="hud-font text-2xl font-bold text-purple-200">
                  <DataCounter value={result.durationSec} suffix=" SEC" decimals={2} />
                </p>
                <p className="text-[10px] text-purple-400/50 mt-1">目線一致時間</p>
              </ResultCard>

              <ResultCard label="Gaze Zone" delay={0.5}>
                <div className="flex items-center gap-3">
                  <RadarCircle value={result.gazeZonePercent} size={80} />
                  <div>
                    <p className={`hud-font text-lg font-bold ${levelColors[result.gazeZoneLevel]}`}>
                      {result.gazeZoneLevel}
                    </p>
                    <p className="text-[9px] text-purple-400/50">認知圏レベル</p>
                  </div>
                </div>
              </ResultCard>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ResultCard label="Face Direction" delay={0.6}>
                <p className="text-sm text-purple-200">
                  あなた側へ{" "}
                  <span className="hud-font text-lg font-bold text-purple-300">
                    {result.faceDirection}°
                  </span>
                </p>
              </ResultCard>

              <ResultCard label="Distance" delay={0.7}>
                <p className="text-sm text-purple-200">
                  約{" "}
                  <span className="hud-font text-lg font-bold text-purple-300">
                    {result.distanceM}m
                  </span>
                </p>
                <Equalizer bars={6} className="mt-2 opacity-50" />
              </ResultCard>
            </div>
          </div>
        </div>

        <motion.div
          className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <GlassPanel className="lg:col-span-2 p-4">
            <p className="hud-font text-[9px] text-purple-400/60 tracking-[0.2em] mb-3">
              EYE CONTACT MOMENT
            </p>
            <Filmstrip highlightIndex={2} timestamp={result.timestamp} />
          </GlassPanel>

          <GlassPanel className="p-4 flex flex-col justify-center">
            <p className="hud-font text-[9px] text-purple-400/60 tracking-[0.2em] mb-3">
              この瞬間のひとこと
            </p>
            <div className="relative">
              <span className="absolute -top-2 -left-1 text-4xl text-purple-500/30">&ldquo;</span>
              <p className="text-sm sm:text-base text-purple-100/90 pl-6 pr-2 leading-relaxed">
                {result.quote}
              </p>
              <span className="absolute -bottom-4 right-0 text-4xl text-purple-500/30">&rdquo;</span>
            </div>
          </GlassPanel>
        </motion.div>

        <motion.div
          className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <GlassPanel className="p-4">
            <p className="hud-font text-[9px] text-purple-400/60 tracking-[0.2em] mb-3">
              HISTORY ARCHIVE
            </p>
            <div className="space-y-2">
              {result.history.map((h) => (
                <div key={h.date} className="flex justify-between text-[11px]">
                  <span className="text-purple-400/50">{h.date}</span>
                  <span className="hud-font text-purple-300">{h.rate}%</span>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="p-4">
            <p className="hud-font text-[9px] text-purple-400/60 tracking-[0.2em] mb-3">
              EYE CONTACT SCORE
            </p>
            <TrendGraph data={result.history} />
          </GlassPanel>

          <GlassPanel className="p-4">
            <p className="hud-font text-[9px] text-purple-400/60 tracking-[0.2em] mb-3">
              MEMORY IMPACT
            </p>
            <div className="flex gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.span
                  key={i}
                  className={`text-lg ${i < result.memoryHearts ? "text-pink-400" : "text-purple-900"}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2 + i * 0.1 }}
                >
                  ♥
                </motion.span>
              ))}
            </div>
            <p className="text-[10px] text-purple-400/60">
              Memory Retention Level:{" "}
              <span className="text-pink-400 font-bold">{result.gazeZoneLevel}</span>
            </p>
          </GlassPanel>

          <GlassPanel className="p-4">
            <p className="hud-font text-[9px] text-purple-400/60 tracking-[0.2em] mb-3">
              MOMENT TAGS
            </p>
            <div className="flex flex-wrap gap-2">
              {result.tags.map((tag, i) => (
                <motion.span
                  key={tag}
                  className="text-[10px] px-2 py-1 rounded-full border border-purple-500/30 text-purple-300/80 bg-purple-500/10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.3 + i * 0.1 }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </GlassPanel>
        </motion.div>

        <motion.footer
          className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-purple-500/10 pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div>
            <p className="text-xl font-black neon-text">3秒認知</p>
            <p className="hud-font text-[8px] text-purple-400/40 tracking-[0.3em]">
              3BYOU NINCHI — EYE MEMORY ARCHIVE
            </p>
          </div>

          <div className="flex items-center gap-3">
            {["X", "IG", "TT"].map((s) => (
              <button
                key={s}
                className="hud-font text-[10px] w-10 h-10 border border-purple-500/30 flex items-center justify-center text-purple-400/60 hover:border-purple-400/50 hover:text-purple-300 transition-colors"
              >
                {s}
              </button>
            ))}
            <NeonButton href="/upload" variant="secondary">
              New Scan
            </NeonButton>
          </div>

          <div className="text-right">
            <p className="hud-font text-[8px] text-purple-500/30 tracking-widest">
              ARCHIVE ID
            </p>
            <p className="hud-font text-[9px] text-purple-400/50">{result.archiveId}</p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
