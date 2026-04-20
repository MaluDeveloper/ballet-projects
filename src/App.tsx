import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NossaHistoria from "./pages/NossaHistoria.tsx";
import Blog from "./pages/Blog.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import Admin from "./pages/Admin.tsx";
import Aulas from "./pages/Aulas.tsx";
import Galeria from "./pages/Galeria.tsx";
import PoliticaDePrivacidade from "./pages/PoliticaDePrivacidade.tsx";
import TermosDeUso from "./pages/TermosDeUso.tsx";
import NotFound from "./pages/NotFound.tsx";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // Wait a tick for the route content to render.
      requestAnimationFrame(() => {
        const el = document.querySelector(hash);
        if (el instanceof HTMLElement) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, hash]);
  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/nossa-historia" element={<NossaHistoria />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/aulas" element={<Aulas />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidade />} />
          <Route path="/termos-de-uso" element={<TermosDeUso />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
