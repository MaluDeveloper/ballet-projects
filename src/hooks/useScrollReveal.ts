import { useCallback, useEffect, useState } from "react";

export const useScrollReveal = (threshold = 0.15) => {
  const [isVisible, setIsVisible] = useState(false);
  const [node, setNode] = useState<Element | null>(null);

  const ref = useCallback((el: HTMLElement | null) => {
    setNode(el);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let observer: IntersectionObserver | null = null;

    const cleanup = () => {
      observer?.disconnect();
      observer = null;
    };

    const observe = (el: Element) => {
      if (typeof IntersectionObserver === "undefined") {
        setIsVisible(true);
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Ensure we get at least one paint in the "hidden" state.
            // If we flip to visible too early, transitions may not run.
            window.requestAnimationFrame(() => {
              if (cancelled) return;
              setIsVisible(true);
              observer?.unobserve(el);
            });
          }
        },
        { threshold, rootMargin: "0px 0px -10% 0px" }
      );

      observer.observe(el);
    };

    if (node && !isVisible) observe(node);

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [threshold, node, isVisible]);

  return { ref, isVisible };
};
