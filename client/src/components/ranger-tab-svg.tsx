interface RangerTabSVGProps {
  size?: "nav" | "lg" | "banner";
  className?: string;
}

export function RangerTabSVG({ size = "nav", className = "" }: RangerTabSVGProps) {
  const dimensions = {
    nav: { width: 90, height: 32, fontSize: 11, strokeWidth: 2 },
    lg: { width: 160, height: 50, fontSize: 18, strokeWidth: 3 },
    banner: { width: 130, height: 42, fontSize: 14, strokeWidth: 2.5 },
  };

  const { width, height, fontSize, strokeWidth } = dimensions[size];
  const arcHeight = height * 0.35;

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
          id={`rangerArc-${size}`}
          d={`M ${width * 0.08} ${height * 0.85} 
              Q ${width * 0.5} ${arcHeight * 0.3} ${width * 0.92} ${height * 0.85}`}
          fill="none"
        />
        <linearGradient id={`goldGradient-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F5D742" />
          <stop offset="50%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>
      </defs>

      <path
        d={`M 0 ${height * 0.9}
            L ${width * 0.06} ${height * 0.6}
            Q ${width * 0.5} ${arcHeight * 0.1} ${width * 0.94} ${height * 0.6}
            L ${width} ${height * 0.9}
            Q ${width * 0.5} ${height * 0.7} 0 ${height * 0.9}
            Z`}
        fill="#000000"
        stroke={`url(#goldGradient-${size})`}
        strokeWidth={strokeWidth}
      />

      <text
        fill="#EAB308"
        fontSize={fontSize}
        fontFamily="'Bebas Neue', sans-serif"
        fontWeight="700"
        letterSpacing="0.15em"
        textAnchor="middle"
      >
        <textPath
          href={`#rangerArc-${size}`}
          startOffset="50%"
        >
          RANGER
        </textPath>
      </text>
    </svg>
  );
}
