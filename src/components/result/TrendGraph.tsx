"use client";

import { motion } from "framer-motion";

interface TrendGraphProps {
  data: { date: string; rate: number }[];
}

export default function TrendGraph({ data }: TrendGraphProps) {
  const reversed = [...data].reverse();
  const maxRate = Math.max(...reversed.map((d) => d.rate));
  const minRate = Math.min(...reversed.map((d) => d.rate));
  const range = maxRate - minRate || 1;

  const points = reversed
    .map((d, i) => {
      const x = (i / (reversed.length - 1)) * 100;
      const y = 100 - ((d.rate - minRate) / range) * 80 - 10;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const areaPath = `${points} L 100 100 L 0 100 Z`;

  return (
    <div className="relative h-24 w-full">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(168,85,247,0.4)" />
            <stop offset="100%" stopColor="rgba(168,85,247,0)" />
          </linearGradient>
        </defs>
        <motion.path
          d={areaPath}
          fill="url(#areaGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        <motion.path
          d={points}
          fill="none"
          stroke="#a855f7"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          style={{ filter: "drop-shadow(0 0 4px rgba(168,85,247,0.6))" }}
        />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
        {reversed.map((d, i) =>
          i % 2 === 0 ? (
            <span key={d.date} className="text-[7px] text-purple-400/40">
              {d.date.slice(5)}
            </span>
          ) : null
        )}
      </div>
    </div>
  );
}
