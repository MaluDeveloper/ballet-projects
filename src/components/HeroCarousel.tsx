import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const slides = [
  {
    image: hero1,
    title: "Arte, disciplina e elegância",
    subtitle: "na Ballet Academy Lumière Étoile.",
  },
  {
    image: hero2,
    title: "Formando bailarinas",
    subtitle: "com amor e dedicação desde a infância.",
  },
  {
    image: hero3,
    title: "Palco, luz e emoção",
    subtitle: "em cada apresentação.",
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const next = useCallback(() => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrent((c) => (c + 1) % slides.length);
      setTransitioning(false);
    }, 400);
  }, []);

  const prev = useCallback(() => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrent((c) => (c - 1 + slides.length) % slides.length);
      setTransitioning(false);
    }, 400);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section id="home" className="relative h-screen min-h-[600px] overflow-hidden">
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
          <span className="inline-block text-primary-foreground/60 text-xs tracking-[0.4em] uppercase mb-6 font-medium">
            Ballet Clássico
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-semibold text-primary-foreground mb-5 max-w-5xl leading-[1.1] drop-shadow-2xl text-center text-balance">
            {slides[current].title}
          </h1>
          <p className="text-lg md:text-2xl text-primary-foreground/85 font-light mb-10 max-w-2xl tracking-wide leading-relaxed text-center text-balance">
            {slides[current].subtitle}
          </p>
        </div>
        <Button
          variant="hero"
          size="lg"
          className="text-base px-10 py-7 shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
          onClick={() => window.open("https://www.whatsapp.com/", "_blank")}
        >
          Agendar Aula Experimental
        </Button>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 backdrop-blur-md text-primary-foreground hover:bg-primary-foreground/15 transition-all duration-300 hover:scale-110"
        aria-label="Anterior"
      >
        <ChevronLeft size={20} className="sm:hidden" />
        <ChevronLeft size={24} className="hidden sm:block" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 backdrop-blur-md text-primary-foreground hover:bg-primary-foreground/15 transition-all duration-300 hover:scale-110"
        aria-label="Próximo"
      >
        <ChevronRight size={20} className="sm:hidden" />
        <ChevronRight size={24} className="hidden sm:block" />
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

export default HeroCarousel;
