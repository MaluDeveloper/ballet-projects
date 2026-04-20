import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeroCarousel from "@/components/PageHeroCarousel";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { fetchPublicPosts, makePostSlug, type CmsPost } from "@/lib/cms";
import blogHero1 from "@/assets/blog-hero-1.jpg";
import blogHero2 from "@/assets/blog-hero-2.jpg";
import blogHero3 from "@/assets/blog-hero-3.jpg";

const POSTS_PER_PAGE = 4;

const PostCard = ({ post, index, isVisible }: { post: CmsPost; index: number; isVisible: boolean }) => {
  const formattedDate = (post.created_at ? new Date(post.created_at) : null)?.toLocaleDateString("pt-BR", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <Link to={`/blog/${makePostSlug(post)}`}>
      <div
        className={`group bg-card rounded-2xl overflow-hidden shadow-sm border border-border/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-700 ease-out ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-10 scale-[0.98]"
        }`}
        style={{ transitionDelay: `${(index % POSTS_PER_PAGE) * 100}ms` }}
      >
        <div className="aspect-[16/10] overflow-hidden relative">
          <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        <div className="p-6 lg:p-8">
          <span className="text-xs text-muted-foreground">{formattedDate ?? "Publicado"}</span>
          <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300 leading-snug mt-3">
            {post.title}
          </h3>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed line-clamp-2">{post.summary}</p>
          <span className="inline-block mt-5 text-sm font-medium text-primary tracking-wide group-hover:translate-x-1 transition-transform duration-300">
            Ler mais →
          </span>
        </div>
      </div>
    </Link>
  );
};

const FeaturedPost = ({ post, isVisible }: { post: CmsPost; isVisible: boolean }) => {
  const formattedDate = (post.created_at ? new Date(post.created_at) : null)?.toLocaleDateString("pt-BR", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <Link to={`/blog/${makePostSlug(post)}`}>
      <div
        className={`group grid lg:grid-cols-2 gap-0 bg-card rounded-2xl overflow-hidden shadow-md border border-border/30 hover:shadow-2xl transition-all duration-700 ease-out mb-16 ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-10 scale-[0.98]"
        }`}
        style={{ transitionDelay: "100ms" }}
      >
        <div className="aspect-[16/10] overflow-hidden relative">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <span className="text-xs text-muted-foreground mb-5">{formattedDate ?? "Publicado"}</span>
          <h2 className="font-serif text-2xl lg:text-3xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300 leading-snug">
            {post.title}
          </h2>
          <p className="text-base text-muted-foreground mt-4 leading-relaxed">{post.summary}</p>
          <span className="inline-block mt-6 text-sm font-medium text-primary tracking-wide group-hover:translate-x-2 transition-transform duration-300">
            Ler artigo completo →
          </span>
        </div>
      </div>
    </Link>
  );
};

const Blog = () => {
  const [allPosts, setAllPosts] = useState<CmsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE + 1);
  const loaderRef = useRef<HTMLDivElement>(null);
  const { ref: contentRef, isVisible: contentVisible } = useScrollReveal(0.1);

  useEffect(() => {
    const run = async () => {
      try {
        const data = await fetchPublicPosts();
        setAllPosts(data);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  const blogSlides = [
    { image: blogHero1, title: "Artigos & Novidades", subtitle: "acompanhe os eventos, apresentações e novidades da Ballet Academy Lumière Étoile." },
    { image: blogHero2, title: "Inspiração e cultura", subtitle: "histórias, bastidores e reflexões sobre o mundo do ballet." },
    { image: blogHero3, title: "Do palco ao dia a dia", subtitle: "dicas, curiosidades e momentos especiais do nosso estúdio." },
  ];

  const loadMore = useCallback(() => {
    setVisibleCount((c) => Math.min(c + POSTS_PER_PAGE, allPosts.length));
  }, [allPosts.length]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) loadMore(); }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const featured = allPosts[0];
  const rest = allPosts.slice(1, visibleCount);
  const hasMore = visibleCount < allPosts.length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeroCarousel slides={blogSlides} eyebrow="Blog" />

      {/* Content */}
      <section
        ref={contentRef}
        className={`py-16 lg:py-24 transition-all duration-700 ease-out ${
          contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          {featured && <FeaturedPost post={featured} isVisible={contentVisible} />}
          {!featured && !loading && (
            <p className="text-center text-sm text-muted-foreground mb-12">Nenhum post publicado no momento.</p>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} isVisible={contentVisible} />
            ))}
          </div>

          {hasMore && (
            <div ref={loaderRef} className="flex items-center justify-center py-16">
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: "200ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: "400ms" }} />
                <span className="ml-2">Carregando mais posts</span>
              </div>
            </div>
          )}

          {!hasMore && allPosts.length > POSTS_PER_PAGE && (
            <div className="text-center pt-12">
              <div className="flex items-center justify-center gap-4 text-muted-foreground/50 text-xs tracking-[0.3em]">
                <span className="h-px w-12 bg-border" />
                <span>✦</span>
                <span className="h-px w-12 bg-border" />
              </div>
              <p className="text-sm text-muted-foreground mt-4">Você viu todos os posts</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
