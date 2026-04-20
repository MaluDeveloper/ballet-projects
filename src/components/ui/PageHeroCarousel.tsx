import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

interface PageHeroCarouselProps {
  slides: Slide[];
  eyebrow?: string;
}

const PageHeroCarousel = ({ slides, eyebrow }: PageHeroCarouselProps) => {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const next = useCallback(() => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrent((c) => (c + 1) % slides.length);
      setTransitioning(false);
    }, 400);
  }, [slides.length]);

  const prev = useCallback(() => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrent((c) => (c - 1 + slides.length) % slides.length);
      setTransitioning(false);
    }, 400);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-all duration-[1200ms] ease-in-out"
          style={{
            opacity: current === i ? 1 : 0,
            transform: current === i ? "scale(1)" : "scale(1.05)",
          }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/30 to-primary/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-transparent to-primary/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <div
          className={`flex flex-col items-center transition-all duration-500 ease-out ${
            transitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
        >
          {eyebrow && (
            <span className="inline-block text-primary-foreground/60 text-xs tracking-[0.4em] uppercase mb-6 font-medium">
              {eyebrow}
            </span>
          )}
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-semibold text-primary-foreground mb-5 max-w-5xl leading-[1.1] drop-shadow-2xl text-center text-balance">
            {slides[current].title}
          </h1>
          <p className="text-lg md:text-2xl text-primary-foreground/85 font-light mb-10 max-w-2xl tracking-wide leading-relaxed text-center text-balance">
            {slides[current].subtitle}
          </p>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 backdrop-blur-md text-primary-foreground hover:bg-primary-foreground/15 transition-all duration-300 hover:scale-110"
        aria-label="Anterior"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 backdrop-blur-md text-primary-foreground hover:bg-primary-foreground/15 transition-all duration-300 hover:scale-110"
        aria-label="Próximo"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-500 ${
              current === i
                ? "bg-primary-foreground w-8 h-2"
                : "bg-primary-foreground/30 w-2 h-2 hover:bg-primary-foreground/50"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default PageHeroCarousel;
