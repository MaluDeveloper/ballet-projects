import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionHeading from "@/components/SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { fetchPublicPosts, makePostSlug, type CmsPost } from "@/lib/cms";

const BlogSection = () => {
  const [posts, setPosts] = useState<CmsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const featured = posts[0];
  const rest = posts.slice(1);
  const { ref, isVisible } = useScrollReveal(0.1);

  useEffect(() => {
    const run = async () => {
      try {
        const data = await fetchPublicPosts();
        setPosts(data.slice(0, 4));
        setError("");
      } catch (err: unknown) {
        const message = typeof err === "object" && err !== null && "message" in err
          ? String((err as { message?: string }).message)
          : "Falha ao carregar posts.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  return (
    <section
      id="blog"
      ref={ref}
      className={`py-24 lg:py-32 bg-muted/30 transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading title="Blog & Novidades" subtitle="Fique por dentro dos eventos, apresentações e notícias do estúdio." />

        {loading && <p className="text-center text-sm text-muted-foreground mb-8">Carregando posts...</p>}
        {!loading && error && <p className="text-center text-sm text-destructive mb-8">{error}</p>}
        {!loading && !error && !featured && (
          <p className="text-center text-sm text-muted-foreground mb-8">Nenhum post publicado no momento.</p>
        )}

        {featured && (
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Featured */}
            <Link
              to={`/blog/${makePostSlug(featured)}`}
              className={`group cursor-pointer transition-all duration-700 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500">
                <div className="aspect-[16/10] lg:aspect-[16/10] overflow-hidden">
                  <img
                    src={featured.image_url}
                    alt={featured.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-xl md:text-2xl font-serif font-semibold text-foreground mt-3 group-hover:text-primary transition-colors duration-300">
                  {featured.title}
                </h3>
                <p className="text-muted-foreground mt-3 leading-relaxed">
                  {featured.summary}
                </p>
              </div>
            </Link>

            {/* Other posts */}
            <div className="flex flex-col gap-8">
              {rest.map((post, idx) => (
                <Link
                  key={post.id}
                  to={`/blog/${makePostSlug(post)}`}
                  className={`group flex gap-5 p-4 rounded-2xl hover:bg-card hover:shadow-md transition-all duration-700 ease-out ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${(idx + 2) * 100}ms` }}
                >
                  <div className="w-44 h-32 flex-shrink-0 rounded-xl overflow-hidden shadow-sm">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-base font-serif font-semibold text-foreground mt-2 group-hover:text-primary transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                      {post.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Link to full blog */}
        {featured && (
          <div className="text-center mt-14">
            <Link
              to="/blog"
              className={`inline-flex items-center gap-2 px-8 py-3 rounded-full border border-primary/30 text-primary font-medium text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-700 ease-out group ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              Ver todas as publicações
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
