"use client";

import { motion } from "framer-motion";
import GlitchText from "./GlitchText";

interface PixelLogoProps {
  size?: "hero" | "md" | "sm";
  showSubtitle?: boolean;
  glitch?: boolean;
  align?: "center" | "left";
  className?: string;
}

const SIZE_CLASS = {
  hero: "pixel-logo-hero",
  md: "pixel-logo-md",
  sm: "pixel-logo-sm",
} as const;

export default function PixelLogo({
  size = "hero",
  showSubtitle = true,
  glitch = size === "hero",
  align = "center",
  className = "",
}: PixelLogoProps) {
  const alignClass = align === "left" ? "text-left" : "text-center";
  const logo = (
    <>
      <span className={`pixel-logo ${SIZE_CLASS[size]}`}>3秒認知</span>
      {showSubtitle && (
        <motion.span
          className={`pixel-subtitle block ${size === "hero" ? "mt-3" : "mt-1.5"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          3BYOU NINCHI
        </motion.span>
      )}
    </>
  );

  if (glitch) {
    return (
      <GlitchText as="h1" className={`${alignClass} ${className}`}>
        {logo}
      </GlitchText>
    );
  }

  return <div className={`${alignClass} ${className}`}>{logo}</div>;
}
