"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface DataCounterProps {
  value: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

export default function DataCounter({
  value,
  suffix = "",
  decimals = 1,
  duration = 2,
  className = "",
}: DataCounterProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = value * eased;
      setDisplay(start);
      if (progress >= 1) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [value, duration]);

  return (
    <span className={className}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function FluctuatingNumber({
  min,
  max,
  decimals = 1,
  suffix = "",
  className = "",
}: {
  min: number;
  max: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}) {
  const [val, setVal] = useState(min);

  useEffect(() => {
    const interval = setInterval(() => {
      setVal(min + Math.random() * (max - min));
    }, 120);
    return () => clearInterval(interval);
  }, [min, max]);

  return (
    <motion.span
      className={className}
      key={Math.floor(val * 10)}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
    >
      {val.toFixed(decimals)}
      {suffix}
    </motion.span>
  );
}
