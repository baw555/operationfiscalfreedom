interface RangerTabSVGProps {
  size?: "nav" | "lg" | "banner";
  className?: string;
}

export function RangerTabSVG({ size = "nav", className = "" }: RangerTabSVGProps) {
  const dimensions = {
    nav: { width: 100, height: 30, fontSize: 12, strokeWidth: 2 },
    lg: { width: 180, height: 52, fontSize: 22, strokeWidth: 3 },
    banner: { width: 140, height: 40, fontSize: 16, strokeWidth: 2.5 },
  };

  const { width, height, fontSize, strokeWidth } = dimensions[size];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`ranger-tab-svg ranger-tab-svg-${size} ${className}`}
      style={{ display: "inline-block" }}
    >
      <defs>
        <path
          id={`textArc-${size}`}
          d={`M ${width * 0.12} ${height * 0.72} 
              Q ${width * 0.5} ${height * 0.15} ${width * 0.88} ${height * 0.72}`}
          fill="none"
        />
        <linearGradient id={`goldGrad-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#DAA520" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>

      <path
        d={`M 2 ${height * 0.92}
            L ${width * 0.08} ${height * 0.55}
            Q ${width * 0.5} ${height * 0.02} ${width * 0.92} ${height * 0.55}
            L ${width - 2} ${height * 0.92}
            L ${width * 0.85} ${height * 0.78}
            Q ${width * 0.5} ${height * 0.55} ${width * 0.15} ${height * 0.78}
            L 2 ${height * 0.92}
            Z`}
        fill="#000000"
        stroke={`url(#goldGrad-${size})`}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />

      <text
        fill="#FFD700"
        fontSize={fontSize}
        fontFamily="'Bebas Neue', Arial Black, sans-serif"
        fontWeight="700"
        letterSpacing="0.12em"
        textAnchor="middle"
      >
        <textPath
          href={`#textArc-${size}`}
          startOffset="50%"
        >
          RANGER
        </textPath>
      </text>
    </svg>
  );
}
