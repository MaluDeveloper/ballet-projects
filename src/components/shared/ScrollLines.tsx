import { useEffect, useRef } from "react";

interface ScrollLinesProps {
  className?: string;
}

const ScrollLines = ({ className = "" }: ScrollLinesProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const paths = svg.querySelectorAll<SVGPathElement>("path[data-scroll-line]");
    paths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
    });

    const onScroll = () => {
      const rect = svg.getBoundingClientRect();
      const viewH = window.innerHeight;
      const start = viewH;
      const end = -rect.height;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));

      paths.forEach((p) => {
        const len = p.getTotalLength();
        p.style.strokeDashoffset = `${len * (1 - progress)}`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <svg
      ref={svgRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      viewBox="0 0 800 2400"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Main choreographic line — intense blue, medium weight */}
      <path
        data-scroll-line
        d="M120,0 C180,100 680,80 620,220 S140,340 200,480 C260,580 700,560 640,700 S160,820 220,960 C300,1060 720,1040 660,1180 S180,1300 240,1440 C320,1540 700,1520 640,1660 S200,1780 260,1920 C340,2020 680,2000 620,2140 S240,2260 320,2400"
        fill="none"
        stroke="hsl(var(--primary) / 0.18)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Secondary accent — lighter, thinner */}
      <path
        data-scroll-line
        d="M680,0 C620,120 130,140 190,300 S660,420 600,560 C540,680 150,660 210,800 S640,920 580,1060 C520,1180 170,1160 230,1300 S620,1420 560,1560 C500,1680 190,1660 250,1800 S600,1920 540,2060 C480,2160 220,2200 300,2400"
        fill="none"
        stroke="hsl(var(--primary) / 0.09)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default ScrollLines;
