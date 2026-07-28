import { useId } from "react";

interface WaveDividerProps {
  from?: string;
  to?: string;
  flip?: boolean;
  className?: string;
}

const WaveDivider = ({
  from = "hsl(var(--primary))",
  to = "hsl(var(--background))",
  flip,
  className = "",
}: WaveDividerProps) => {
  const uid = useId().replace(/:/g, "");

  return (
    <div className={`relative w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""} ${className}`}>
      <svg
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        className="w-full h-[60px] md:h-[80px] lg:h-[100px] block"
      >
        <defs>
          {/* Vertical gradient for the top wave shape — fades from "from" into a mid-blue */}
          <linearGradient id={`wg-top-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={from} stopOpacity="1" />
            <stop offset="40%" stopColor="hsl(224 65% 38%)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="hsl(224 55% 45%)" stopOpacity="0.4" />
          </linearGradient>

          {/* Horizontal shimmer for the mid accent wave */}
          <linearGradient id={`wg-mid-${uid}`} x1="0" y1="0" x2="1" y2="0.3">
            <stop offset="0%" stopColor="hsl(224 70% 42%)" stopOpacity="0.25" />
            <stop offset="30%" stopColor="hsl(224 60% 55%)" stopOpacity="0.18" />
            <stop offset="60%" stopColor="hsl(224 50% 60%)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="hsl(224 70% 42%)" stopOpacity="0.2" />
          </linearGradient>

          {/* Bottom fill — blends into "to" */}
          <linearGradient id={`wg-bot-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(224 60% 48%)" stopOpacity="0.15" />
            <stop offset="100%" stopColor={to} stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Layer 1 — back: bottom fill that blends into the destination */}
        <path
          d="M0,50 C180,110 360,10 540,60 C720,110 900,25 1080,65 C1200,85 1350,35 1440,55 L1440,140 L0,140 Z"
          fill={`url(#wg-bot-${uid})`}
        />

        {/* Layer 2 — mid accent wave: subtle blue shimmer */}
        <path
          d="M0,65 C240,20 480,95 720,55 C960,15 1200,80 1440,45 L1440,140 L0,140 Z"
          fill={`url(#wg-mid-${uid})`}
        />

        {/* Layer 3 — top: primary wave shape */}
        <path
          d="M0,60 C200,115 400,8 600,55 C800,102 1000,22 1200,62 C1320,78 1400,42 1440,52 L1440,0 L0,0 Z"
          fill={`url(#wg-top-${uid})`}
        />
      </svg>
    </div>
  );
};

export default WaveDivider;
