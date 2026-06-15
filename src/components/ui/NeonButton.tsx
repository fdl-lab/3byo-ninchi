"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface NeonButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  disabled?: boolean;
}

export default function NeonButton({
  href,
  onClick,
  children,
  variant = "primary",
  className = "",
  disabled = false,
}: NeonButtonProps) {
  const baseClass =
    "relative inline-flex items-center justify-center gap-2 px-8 py-3.5 hud-font text-xs font-bold uppercase tracking-[0.2em] transition-all disabled:opacity-40 disabled:cursor-not-allowed";

  const variantClass =
    variant === "primary"
      ? "bg-purple-600/20 text-purple-200 border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:border-purple-400/70"
      : "bg-transparent text-purple-300/80 border border-purple-500/30 hover:border-purple-400/50 hover:text-purple-200";

  const content = (
    <motion.span
      className={`${baseClass} ${variantClass} ${className}`}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-500/10 to-purple-600/0 opacity-0 hover:opacity-100 transition-opacity" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.span>
  );

  if (href && !disabled) {
    return <Link href={href}>{content}</Link>;
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} className="inline-block">
      {content}
    </button>
  );
}
