"use client";

import { motion } from "framer-motion";

interface RadarCircleProps {
  value: number;
  size?: number;
  label?: string;
  className?: string;
}

export default function RadarCircle({
  value,
  size = 120,
  label,
  className = "",
}: RadarCircleProps) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(168,85,247,0.15)"
            strokeWidth="3"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#radarGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{ filter: "drop-shadow(0 0 6px rgba(168,85,247,0.6))" }}
          />
          <defs>
            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>

        <motion.div
          className="absolute inset-3 rounded-full border border-purple-500/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
        </motion.div>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="hud-font text-2xl font-bold text-purple-200 neon-text">
            {value}
            <span className="text-sm">%</span>
          </span>
        </div>
      </div>
      {label && (
        <span className="mt-2 text-[10px] uppercase tracking-widest text-purple-400/70">
          {label}
        </span>
      )}
    </div>
  );
}
