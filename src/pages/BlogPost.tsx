import { useEffect, useMemo, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { fetchPublicPosts, makePostSlug, type CmsPost } from "@/lib/cms";
import { toSafeHtmlFromContent } from "@/lib/richText";
import balletAbstract1 from "@/assets/ballet-abstract-1.png";
import balletAbstract2 from "@/assets/ballet-abstract-2.png";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [posts, setPosts] = useState<CmsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, isVisible } = useScrollReveal(0.05);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const run = async () => {
      try {
        const data = await fetchPublicPosts();
        setPosts(data);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  const post = useMemo(() => {
    if (!slug) return undefined;
    return posts.find((item) => makePostSlug(item) === slug);
  }, [posts, slug]);

  const relatedPosts = useMemo(
    () => posts.filter((p) => p.id !== post?.id).slice(0, 3),
    [post?.id, posts],
  );

  if (loading) return null;
  if (!post) return <Navigate to="/blog" replace />;

  const allImages: string[] = post.image_urls?.length
    ? post.image_urls
    : (post.image_url ? [post.image_url] : []);

  const formattedDate = post.created_at
    ? new Date(post.created_at).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-primary/[0.12] via-primary/[0.06] to-primary/[0.08]">
      <Navbar />

      {/* Soft gradient top band for navbar contrast */}
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-primary/[0.18] via-primary/[0.10] to-transparent pointer-events-none z-0" />

      {/* Abstract ballet figure — top right, decorative */}
      <img
        src={balletAbstract1}
        alt=""
        aria-hidden="true"
        loading="lazy"
        width={512}
        height={768}
        className="absolute right-2 top-24 w-44 md:w-56 opacity-[0.06] pointer-events-none select-none z-0"
      />

      {/* Abstract ballet figure — mid-left, decorative */}
      <img
        src={balletAbstract2}
        alt=""
        aria-hidden="true"
        loading="lazy"
        width={512}
        height={768}
        className="absolute left-2 top-[55%] w-40 md:w-52 opacity-[0.05] pointer-events-none select-none z-0 -scale-x-100"
      />

      {/* Subtle radial glow mid-page */}
      <div className="absolute left-1/2 top-[40%] -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.04] blur-3xl pointer-events-none z-0" />

      <article
        ref={ref}
        className={`relative z-10 pt-28 lg:pt-36 pb-16 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 mb-10 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
            Ir para o Blog
          </Link>

          {formattedDate && (
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs text-muted-foreground">{formattedDate}</span>
            </div>
          )}

          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10 font-light">
            {post.subtitle}
          </p>

          {/* Image section — carousel if multiple, single if one */}
          {allImages.length > 1 ? (
            <div className="flex justify-center mb-12">
              <div className="rounded-2xl overflow-hidden shadow-lg max-w-2xl w-full relative">
                <img
                  src={allImages[currentSlide]}
                  alt={post.title}
                  className="w-full h-auto object-contain transition-opacity duration-500"
                />
                <button
                  onClick={() => setCurrentSlide((s) => (s - 1 + allImages.length) % allImages.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                >
                  <ChevronLeft size={20} className="text-foreground" />
                </button>
                <button
                  onClick={() => setCurrentSlide((s) => (s + 1) % allImages.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                >
                  <ChevronRight size={20} className="text-foreground" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {allImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        i === currentSlide ? "bg-white scale-110" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : allImages.length === 1 ? (
            <div className="flex justify-center mb-12">
              <div className="rounded-2xl overflow-hidden shadow-lg max-w-2xl w-full">
                <img src={allImages[0]} alt={post.title} className="w-full h-auto object-contain" />
              </div>
            </div>
          ) : null}

          <div className="flex items-center gap-4 mb-10">
            <span className="h-px flex-1 bg-border" />
            <span className="text-muted-foreground/30 text-xs">✦</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div
            className="prose prose-lg max-w-none text-foreground/85 leading-[1.85] whitespace-pre-line [&_*]:whitespace-pre-line 
              prose-headings:font-serif prose-headings:text-foreground prose-headings:mt-10 prose-headings:mb-4
              prose-p:my-0 prose-p:whitespace-pre-line
              prose-strong:text-foreground prose-strong:font-semibold
              prose-ul:my-6 prose-li:my-1 prose-li:whitespace-pre-line
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: toSafeHtmlFromContent(post.content) }}
          />
        </div>

        {relatedPosts.length > 0 && (
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl mt-20 mb-16">
            <h3 className="font-serif text-2xl font-semibold text-foreground text-center mb-10">
              Leia Também
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((rp) => (
                <Link key={rp.id} to={`/blog/${makePostSlug(rp)}`} className="group">
                  <div className="rounded-2xl overflow-hidden shadow-sm border border-border/30 hover:shadow-lg transition-all duration-500">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={rp.image_url}
                        alt={rp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-5">
                      <h4 className="font-serif text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300 leading-snug">
                        {rp.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;