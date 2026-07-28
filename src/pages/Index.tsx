import Navbar from "@/components/layout/Navbar";
import HeroCarousel from "@/components/sections/HeroCarousel";
import BlogSection from "@/components/sections/BlogSection";
import ClassesSection from "@/components/sections/ClassesSection";
import GallerySection from "@/components/sections/GallerySection";
import EventsSection from "@/components/sections/EventsSection";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroCarousel />
      <BlogSection />
      <ClassesSection />
      <GallerySection />
      <EventsSection />
      <Footer />
    </div>
  );
};

export default Index;
