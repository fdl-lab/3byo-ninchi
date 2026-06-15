interface CornerBracketsProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function CornerBrackets({
  className = "",
  size = "md",
}: CornerBracketsProps) {
  const s = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-8 h-8" : "w-6 h-6";
  const border = "border-purple-400/60";

  return (
    <>
      <span className={`absolute top-0 left-0 ${s} border-t-2 border-l-2 ${border} ${className}`} />
      <span className={`absolute top-0 right-0 ${s} border-t-2 border-r-2 ${border} ${className}`} />
      <span className={`absolute bottom-0 left-0 ${s} border-b-2 border-l-2 ${border} ${className}`} />
      <span className={`absolute bottom-0 right-0 ${s} border-b-2 border-r-2 ${border} ${className}`} />
    </>
  );
}
