import { useState, useEffect, useCallback, useRef } from "react";

export const useMouseParallax = (intensity = 20) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = ((e.clientX - centerX) / rect.width) * intensity;
      const y = ((e.clientY - centerY) / rect.height) * intensity;
      setOffset({ x, y });
    },
    [intensity]
  );

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return { containerRef, offset };
};
