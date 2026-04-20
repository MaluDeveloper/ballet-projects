import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SectionHeading from "@/components/SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { X } from "lucide-react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const images = [
  { src: gallery1, alt: "Ensaio no estúdio" },
  { src: gallery2, alt: "Bastidores da apresentação" },
  { src: gallery3, alt: "Apresentação no palco" },
  { src: gallery4, alt: "Sapatilhas de ballet" },
  { src: gallery5, alt: "Salto em silhueta" },
  { src: gallery6, alt: "Momento no estúdio" },
];

const Lightbox = ({ image, onClose }: { image: typeof images[0] | null; onClose: () => void }) => {
  if (!image) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 cursor-pointer" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/80 backdrop-blur-md" />
      <button onClick={onClose} className="absolute top-6 right-6 z-10 text-primary-foreground/80 hover:text-primary-foreground transition-colors" aria-label="Fechar">
        <X size={28} />
      </button>
      <img
        src={image.src}
        alt={image.alt}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-scale-in cursor-default"
      />
    </div>
  );
};

const GallerySection = () => {
  const { ref, isVisible } = useScrollReveal();
  const [selectedImage, setSelectedImage] = useState<typeof images[0] | null>(null);

  useEffect(() => {
    document.body.style.overflow = selectedImage ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedImage]);

  return (
    <section id="galeria" className="py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading title="Galeria" subtitle="Momentos de arte, dedicação e beleza capturados em nosso estúdio" />

        <div
          ref={ref}
          className={`grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {images.map((img, i) => (
            <div
              key={i}
              onClick={() => setSelectedImage(img)}
              className={`overflow-hidden rounded-2xl shadow-md group cursor-pointer relative ${
                i === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out min-h-[200px]"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/15 transition-colors duration-500" />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link
            to="/galeria"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-primary/30 text-primary font-medium text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            Ver toda a Galeria
          </Link>
        </div>
      </div>

      <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
    </section>
  );
};

export default GallerySection;
