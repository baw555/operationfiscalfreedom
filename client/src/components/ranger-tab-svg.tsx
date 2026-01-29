interface RangerTabSVGProps {
  size?: "nav" | "lg" | "banner";
  className?: string;
}

export function RangerTabSVG({ size = "nav", className = "" }: RangerTabSVGProps) {
  const dimensions = {
    nav: { padding: "px-3 py-1", fontSize: "text-xs" },
    lg: { padding: "px-6 py-2", fontSize: "text-xl" },
    banner: { padding: "px-4 py-1.5", fontSize: "text-sm" },
  };

  const { padding, fontSize } = dimensions[size];

  return (
    <div
      className={`inline-block ${padding} bg-black border-2 border-yellow-500 rounded ${className}`}
    >
      <span
        className={`${fontSize} font-bold tracking-widest text-yellow-500`}
        style={{ fontFamily: "'Bebas Neue', Arial Black, sans-serif" }}
      >
        RANGER
      </span>
    </div>
  );
}
