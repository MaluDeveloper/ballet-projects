import { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeroCarousel from "@/components/PageHeroCarousel";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { X } from "lucide-react";
import galeriaHero1 from "@/assets/galeria-hero-1.jpg";
import galeriaHero2 from "@/assets/galeria-hero-2.jpg";
import galeriaHero3 from "@/assets/galeria-hero-3.jpg";
import { fetchGalleryPhotos, type CmsGalleryPhoto } from "@/lib/cms";

const IMAGES_PER_LOAD = 6;

type GalleryImage = { src: string; alt: string; span: "sm" | "md" | "lg" | "tall" | "wide" };

const Lightbox = ({ image, onClose }: { image: GalleryImage | null; onClose: () => void }) => {
  if (!image) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-foreground/80 backdrop-blur-md pointer-events-none" />
      <button onClick={onClose} className="absolute top-6 right-6 z-10 text-primary-foreground/80 hover:text-primary-foreground transition-colors" aria-label="Fechar">
        <X size={28} />
      </button>
      <div className="relative z-10 w-full max-w-[90vw] sm:max-w-2xl lg:max-w-4xl mx-auto">
        <img
          src={image.src}
          alt={image.alt}
          className="w-full max-h-[80dvh] object-contain rounded-lg shadow-2xl animate-scale-in"
        />
      </div>
    </div>
  );
};

const GalleryItem = ({ image, index, onClick, isVisible }: { image: GalleryImage; index: number; onClick: () => void; isVisible: boolean }) => {
  const spanClasses: Record<string, string> = {
    sm: "", md: "", lg: "md:col-span-2 md:row-span-2", tall: "md:row-span-2", wide: "md:col-span-2",
  };

  return (
    <div
      onClick={onClick}
      className={`group overflow-hidden rounded-2xl shadow-md cursor-pointer relative ${spanClasses[image.span]} transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${(index % IMAGES_PER_LOAD) * 80}ms` }}
    >
      <img src={image.src} alt={image.alt} className="w-full h-full object-cover min-h-[220px] group-hover:scale-[1.06] transition-transform duration-700 ease-out" />
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/15 transition-colors duration-500" />
    </div>
  );
};

const Galeria = () => {
  const [allImages, setAllImages] = useState<CmsGalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(IMAGES_PER_LOAD);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal(0.1);

  const galeriaSlides = [
    { image: galeriaHero1, title: "Momentos de arte e beleza", subtitle: "capturados em nosso estúdio e palcos." },
    { image: galeriaHero2, title: "Cada movimento conta uma história", subtitle: "de dedicação, paixão e elegância." },
    { image: galeriaHero3, title: "Nossos momentos mais especiais", subtitle: "registrados com carinho e sensibilidade." },
  ];

  useEffect(() => {
    const run = async () => {
      try {
        const data = await fetchGalleryPhotos();
        setAllImages(data);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  const loadMore = useCallback(() => {
    setVisibleCount((c) => Math.min(c + IMAGES_PER_LOAD, allImages.length));
  }, [allImages.length]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) loadMore(); }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  // Keep page scroll available while lightbox is open.

  const spans: GalleryImage["span"][] = ["lg", "tall", "md", "wide", "tall", "md", "wide", "sm"];
  const visible = allImages.slice(0, visibleCount).map((img, i) => ({
    src: img.image_url,
    alt: `Imagem ${i + 1}`,
    span: spans[i % spans.length],
  }));
  const hasMore = visibleCount < allImages.length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeroCarousel slides={galeriaSlides} eyebrow="Nossos Momentos" />

      {/* Gallery Grid */}
      <section
        ref={gridRef}
        className={`py-16 lg:py-24 transition-all duration-700 ease-out ${
          gridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5 auto-rows-[220px] md:auto-rows-[260px] grid-flow-dense">
            {visible.map((img, i) => (
              <GalleryItem key={i} image={img} index={i} isVisible={gridVisible} onClick={() => setSelectedImage(img)} />
            ))}
          </div>

          {!loading && visible.length === 0 && (
            <p className="text-center text-sm text-muted-foreground mt-10">Nenhuma foto publicada na galeria.</p>
          )}

          {hasMore && (
            <div ref={loaderRef} className="flex items-center justify-center py-16">
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: "200ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: "400ms" }} />
                <span className="ml-2">Carregando mais fotos</span>
              </div>
            </div>
          )}

          {!hasMore && (
            <div className="text-center pt-12">
              <div className="flex items-center justify-center gap-4 text-muted-foreground/50 text-xs tracking-[0.3em]">
                <span className="h-px w-12 bg-border" />
                <span>✦</span>
                <span className="h-px w-12 bg-border" />
              </div>
            </div>
          )}
        </div>
      </section>

      <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
      <Footer />
    </div>
  );
};

export default Galeria;
