"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface VideoDisplayProps {
  src: string;
  isPortrait?: boolean;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  opacity?: number;
}

export default function VideoDisplay({
  src,
  isPortrait = false,
  className = "",
  autoPlay = true,
  muted = true,
  loop = true,
  controls = false,
  opacity = 1,
}: VideoDisplayProps) {
  const [loaded, setLoaded] = useState(false);
  const [detectedPortrait, setDetectedPortrait] = useState(isPortrait);

  useEffect(() => {
    setDetectedPortrait(isPortrait);
  }, [isPortrait]);

  const portrait = detectedPortrait;

  return (
    <div
      className={`relative w-full overflow-hidden bg-black/40 ${
        portrait ? "aspect-[9/16] max-h-[70vh] mx-auto" : "aspect-video"
      } ${className}`}
    >
      {!loaded && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-indigo-900/20"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      <video
        src={src}
        className={`w-full h-full ${portrait ? "object-contain" : "object-cover"}`}
        style={{ opacity: loaded ? opacity : 0 }}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        playsInline
        onLoadedMetadata={(e) => {
          const v = e.currentTarget;
          if (!isPortrait) {
            setDetectedPortrait(v.videoHeight > v.videoWidth);
          }
          setLoaded(true);
        }}
      />
    </div>
  );
}

export function getVideoContainerClass(isPortrait: boolean, variant: "result" | "analyzing" | "upload" = "result") {
  if (!isPortrait) {
    return variant === "result"
      ? "aspect-video"
      : variant === "analyzing"
        ? "aspect-video max-w-md"
        : "aspect-video";
  }

  switch (variant) {
    case "result":
      return "aspect-[9/16] max-h-[65vh] sm:max-h-[70vh] w-full max-w-[280px] sm:max-w-xs mx-auto lg:mx-0";
    case "analyzing":
      return "aspect-[9/16] max-h-[55vh] w-full max-w-[260px] mx-auto";
    case "upload":
      return "aspect-[9/16] max-h-[50vh] w-full max-w-xs mx-auto";
    default:
      return "aspect-[9/16] max-h-[65vh]";
  }
}
