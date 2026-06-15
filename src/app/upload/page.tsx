"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import NeonBackground from "@/components/ui/NeonBackground";
import ScanLine from "@/components/ui/ScanLine";
import GlassPanel from "@/components/ui/GlassPanel";
import NeonButton from "@/components/ui/NeonButton";
import CornerBrackets from "@/components/ui/CornerBrackets";
import { getVideoContainerClass } from "@/components/ui/VideoDisplay";
import ConvertProgressPanel from "@/components/upload/ConvertProgressPanel";
import { saveVideoUrl } from "@/lib/videoStore";
import {
  ConvertProgress,
  needsConversion,
  prepareVideoForAnalysis,
} from "@/lib/videoConvert";

const ACCEPTED = ["video/mp4", "video/quicktime", "video/mov"];

const INITIAL_PROGRESS: ConvertProgress = {
  stage: "loading",
  progress: 0,
  message: "準備中...",
};

export default function UploadPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const processedUrlRef = useRef<string | null>(null);

  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPortrait, setIsPortrait] = useState(false);
  const [willConvert, setWillConvert] = useState(false);
  const [checking, setChecking] = useState(false);
  const [converting, setConverting] = useState(false);
  const [convertProgress, setConvertProgress] = useState<ConvertProgress>(INITIAL_PROGRESS);
  const [error, setError] = useState<string | null>(null);

  const revokeProcessedUrl = useCallback(() => {
    if (processedUrlRef.current) {
      URL.revokeObjectURL(processedUrlRef.current);
      processedUrlRef.current = null;
    }
  }, []);

  const handleFile = useCallback(
    async (f: File) => {
      setError(null);
      revokeProcessedUrl();

      const isValid =
        ACCEPTED.includes(f.type) ||
        f.name.endsWith(".mp4") ||
        f.name.endsWith(".mov");

      if (!isValid) {
        setError("mp4 / mov 形式の動画のみ対応しています");
        return;
      }

      if (previewUrl) URL.revokeObjectURL(previewUrl);

      const url = URL.createObjectURL(f);
      setFile(f);
      setPreviewUrl(url);
      setIsPortrait(false);
      setWillConvert(false);
      setChecking(true);

      try {
        const convertNeeded = await needsConversion(f);
        setWillConvert(convertNeeded);
      } catch {
        setWillConvert(f.name.toLowerCase().endsWith(".mov"));
      } finally {
        setChecking(false);
      }
    },
    [previewUrl, revokeProcessedUrl]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const resetFile = () => {
    revokeProcessedUrl();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setWillConvert(false);
    setError(null);
  };

  const startAnalysis = async () => {
    if (!file) return;

    setError(null);
    setConverting(true);
    setConvertProgress(INITIAL_PROGRESS);

    try {
      const { blob, converted } = await prepareVideoForAnalysis(file, setConvertProgress);

      revokeProcessedUrl();
      const analysisUrl = URL.createObjectURL(blob);
      processedUrlRef.current = analysisUrl;

      if (converted) {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(analysisUrl);
      }

      saveVideoUrl(analysisUrl);
      router.push("/analyzing");
    } catch (err) {
      const message =
        err instanceof Error && err.message.includes("FFmpeg")
          ? "動画の変換に失敗しました。ファイルサイズを小さくするか、別の動画をお試しください"
          : "動画の処理に失敗しました。もう一度お試しください";
      setError(message);
      setConverting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <NeonBackground />
      <ScanLine />

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-8 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <p className="hud-font text-[10px] tracking-[0.4em] text-purple-400/60 mb-2">
            STEP 01 — DATA INPUT
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold neon-text">動画をアップロード</h1>
          <p className="mt-2 text-sm text-purple-300/60">
            推しのライブ動画を投入してください
          </p>
          <p className="mt-1 text-[10px] text-purple-400/40">
            iPhone HEVC / MOV 対応 · 自動 MP4 変換
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <GlassPanel
              className={`relative p-8 sm:p-12 transition-all duration-300 ${
                dragging
                  ? "border-purple-400/60 shadow-[0_0_40px_rgba(168,85,247,0.3)]"
                  : ""
              }`}
            >
              <CornerBrackets />

              <input
                ref={inputRef}
                type="file"
                accept="video/mp4,video/quicktime,.mp4,.mov"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />

              <AnimatePresence mode="wait">
                {converting ? (
                  <motion.div
                    key="converting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ConvertProgressPanel progress={convertProgress} />
                  </motion.div>
                ) : !previewUrl ? (
                  <motion.div
                    key="dropzone"
                    className="flex flex-col items-center gap-6 py-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="w-20 h-20 rounded-full border border-purple-500/30 flex items-center justify-center"
                      animate={{
                        borderColor: [
                          "rgba(168,85,247,0.3)",
                          "rgba(236,72,153,0.5)",
                          "rgba(168,85,247,0.3)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <svg
                        className="w-8 h-8 text-purple-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </motion.div>

                    <div className="text-center">
                      <p className="text-sm text-purple-200/80">ドラッグ&ドロップ</p>
                      <p className="text-xs text-purple-400/50 mt-1">
                        または タップしてファイルを選択
                      </p>
                      <p className="hud-font text-[9px] text-purple-500/40 mt-3 tracking-widest">
                        MP4 / MOV · HEVC OK
                      </p>
                    </div>

                    <NeonButton onClick={() => inputRef.current?.click()} variant="secondary">
                      Select File
                    </NeonButton>
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                    className="flex flex-col items-center gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div
                      className={`relative w-full rounded-sm overflow-hidden border border-purple-500/30 ${getVideoContainerClass(isPortrait, "upload")}`}
                    >
                      <video
                        src={previewUrl}
                        className={`w-full h-full ${isPortrait ? "object-contain bg-black/60" : "object-cover"}`}
                        controls
                        muted
                        playsInline
                        onLoadedMetadata={(e) => {
                          const v = e.currentTarget;
                          setIsPortrait(v.videoHeight > v.videoWidth);
                        }}
                      />
                      <motion.div
                        className="absolute top-2 left-2 hud-font text-[9px] px-2 py-0.5 bg-black/60 text-green-400 border border-green-500/30"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        PREVIEW LOADED
                      </motion.div>
                      {isPortrait && (
                        <div className="absolute top-2 right-2 hud-font text-[8px] px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          縦型
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-purple-300/60 truncate max-w-full">{file?.name}</p>

                    {checking ? (
                      <p className="hud-font text-[9px] text-purple-400/50 tracking-widest animate-pulse">
                        FORMAT CHECK...
                      </p>
                    ) : willConvert ? (
                      <motion.div
                        className="hud-font text-[9px] px-3 py-1.5 border border-amber-500/40 text-amber-300/90 bg-amber-500/10 tracking-wider"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        HEVC / MOV 検出 → 解析前に MP4 変換します
                      </motion.div>
                    ) : (
                      <p className="hud-font text-[9px] text-green-400/60 tracking-widest">
                        MP4 READY · 変換不要
                      </p>
                    )}

                    <div className="flex gap-3 flex-wrap justify-center">
                      <NeonButton onClick={startAnalysis} disabled={checking}>
                        Start Analysis
                      </NeonButton>
                      <NeonButton variant="secondary" onClick={resetFile}>
                        Change File
                      </NeonButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassPanel>
          </div>

          {error && (
            <motion.p
              className="mt-4 text-center text-sm text-red-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <NeonButton href="/" variant="secondary">
            ← Back to Top
          </NeonButton>
        </motion.div>
      </div>
    </div>
  );
}
