"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AnalysisResult } from "@/lib/mockAnalysis";
import {
  buildShareText,
  downloadBlob,
  generateShareImage,
} from "@/lib/shareImage";
import NeonButton from "@/components/ui/NeonButton";

interface ShareActionsProps {
  result: AnalysisResult;
}

export default function ShareActions({ result }: ShareActionsProps) {
  const [generating, setGenerating] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const blob = await generateShareImage({
        result,
        heroFrameDataUrl: result.heroFrameDataUrl || result.frames[result.highlightFrameIndex]?.dataUrl,
      });
      if (shareUrl) URL.revokeObjectURL(shareUrl);
      const url = URL.createObjectURL(blob);
      setShareUrl(url);
      downloadBlob(blob, `3byo-ninchi-${result.archiveId}.png`);
    } catch {
      setError("画像の生成に失敗しました");
    } finally {
      setGenerating(false);
    }
  };

  const handleNativeShare = async () => {
    const text = buildShareText(result);
    try {
      if (shareUrl && navigator.share) {
        const res = await fetch(shareUrl);
        const blob = await res.blob();
        const file = new File([blob], `3byo-ninchi.png`, { type: "image/png" });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ text, files: [file], title: "3秒認知" });
          return;
        }
      }
      if (navigator.share) {
        await navigator.share({ text, title: "3秒認知" });
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* user cancelled */
    }
  };

  const handleCopyText = async () => {
    await navigator.clipboard.writeText(buildShareText(result));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(buildShareText(result))}`;

  return (
    <div className="space-y-4">
      <GlassPanelHeader label="SHARE ARCHIVE" />

      {shareUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mx-auto max-w-[200px] overflow-hidden rounded-sm border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shareUrl} alt="シェア画像プレビュー" className="w-full h-auto" />
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
            <p className="hud-font text-[8px] text-purple-300 text-center tracking-widest">
              GENERATED
            </p>
          </div>
        </motion.div>
      )}

      <div className="flex flex-wrap gap-2 justify-center">
        <NeonButton onClick={handleGenerate} disabled={generating}>
          {generating ? "Generating..." : "画像を生成"}
        </NeonButton>
        <NeonButton onClick={handleNativeShare} variant="secondary">
          シェア
        </NeonButton>
        <NeonButton onClick={handleCopyText} variant="secondary">
          {copied ? "Copied!" : "テキストコピー"}
        </NeonButton>
      </div>

      <div className="flex gap-2 justify-center">
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hud-font text-[10px] w-12 h-12 border border-purple-500/30 flex items-center justify-center text-purple-400/70 hover:border-purple-400/50 hover:text-purple-200 transition-colors"
        >
          X
        </a>
        <button
          type="button"
          onClick={handleCopyText}
          className="hud-font text-[10px] w-12 h-12 border border-purple-500/30 flex items-center justify-center text-purple-400/70 hover:border-purple-400/50 hover:text-purple-200 transition-colors"
        >
          IG
        </button>
        <button
          type="button"
          onClick={handleNativeShare}
          className="hud-font text-[10px] w-12 h-12 border border-purple-500/30 flex items-center justify-center text-purple-400/70 hover:border-purple-400/50 hover:text-purple-200 transition-colors"
        >
          TT
        </button>
      </div>

      {error && <p className="text-center text-sm text-red-400">{error}</p>}

      <p className="text-center text-[10px] text-purple-400/40">
        1080×1920 のシェア画像 · TikTok / X / Instagram 向け
      </p>
    </div>
  );
}

function GlassPanelHeader({ label }: { label: string }) {
  return (
    <p className="hud-font text-[9px] text-purple-400/60 tracking-[0.2em] text-center">
      {label}
    </p>
  );
}
