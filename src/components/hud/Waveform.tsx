"use client";

import { motion } from "framer-motion";

interface WaveformProps {
  className?: string;
  points?: number;
}

export default function Waveform({ className = "", points = 40 }: WaveformProps) {
  const pathPoints = Array.from({ length: points }, (_, i) => {
    const x = (i / (points - 1)) * 100;
    const y = 50 + Math.sin(i * 0.5) * 20 + Math.random() * 10;
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        <motion.path
          d={pathPoints}
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth="0.8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
        <motion.path
          d={pathPoints}
          fill="none"
          stroke="rgba(236,72,153,0.3)"
          strokeWidth="0.4"
          animate={{
            d: [
              pathPoints,
              Array.from({ length: points }, (_, i) => {
                const x = (i / (points - 1)) * 100;
                const y = 50 + Math.sin(i * 0.5 + 1) * 25;
                return `${i === 0 ? "M" : "L"} ${x} ${y}`;
              }).join(" "),
              pathPoints,
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
