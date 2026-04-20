import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import BlogSection from "@/components/BlogSection";
import ClassesSection from "@/components/ClassesSection";
import GallerySection from "@/components/GallerySection";
import EventsSection from "@/components/EventsSection";
import Footer from "@/components/Footer";

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
