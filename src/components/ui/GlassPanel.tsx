import { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
}

export default function GlassPanel({ children, className = "" }: GlassPanelProps) {
  return (
    <div className={`glass-panel neon-border rounded-sm ${className}`}>{children}</div>
  );
}
