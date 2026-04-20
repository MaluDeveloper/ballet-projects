import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import SectionHeading from "@/components/SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { X } from "lucide-react";
import { fetchGalleryPhotos, type CmsGalleryPhoto } from "@/lib/cms";

type GalleryPreview = { src: string; alt: string };

const Lightbox = ({ image, onClose }: { image: GalleryPreview | null; onClose: () => void }) => {
  if (!image) return null;
  const overlay = (
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

  // Important: render outside any transformed parent (ScrollReveal uses transforms).
  return typeof document !== "undefined" ? createPortal(overlay, document.body) : overlay;
};

const GallerySection = () => {
  const { ref, isVisible } = useScrollReveal(0.1);
  const [images, setImages] = useState<CmsGalleryPhoto[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryPreview | null>(null);

  useEffect(() => {
    const run = async () => {
      const data = await fetchGalleryPhotos();
      setImages(data.slice(0, 6));
    };
    void run();
  }, []);

  // Keep page scroll available while lightbox is open.

  const openLightbox = (img: CmsGalleryPhoto, index: number) =>
    setSelectedImage({ src: img.image_url, alt: `Imagem ${index + 1}` });

  return (
    <section
      id="galeria"
      ref={ref}
      className={`py-24 lg:py-32 bg-muted/30 transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading title="Galeria" subtitle="Momentos de arte, dedicação e beleza capturados em nosso estúdio" />

        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5 auto-rows-[150px] sm:auto-rows-[180px] md:auto-rows-[210px] grid-flow-dense"
        >
          {images.map((img, i) => (
            <GalleryTile
              key={img.id}
              img={img}
              index={i}
              isFeatured={i === 0}
              onClick={() => openLightbox(img, i)}
              isVisible={isVisible}
            />
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

const GalleryTile = ({
  img,
  index,
  isFeatured,
  onClick,
  isVisible,
}: {
  img: CmsGalleryPhoto;
  index: number;
  isFeatured: boolean;
  onClick: () => void;
  isVisible: boolean;
}) => {
  return (
    <div
      onClick={onClick}
      className={`overflow-hidden rounded-2xl shadow-md group cursor-pointer relative transition-all duration-700 ease-out ${
        isFeatured ? "md:col-span-2 md:row-span-2" : ""
      } ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-[0.98]"}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <img
        src={img.image_url}
        alt=""
        className="w-full h-full object-cover object-center group-hover:scale-[1.06] transition-transform duration-700 ease-out"
      />
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/15 transition-colors duration-500" />
    </div>
  );
};
