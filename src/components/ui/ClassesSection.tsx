import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { fetchPublicModalidadesAsCards, type PublicModalidadeCard } from "@/lib/modalidadesPublic";
import { X, Calendar, Clock, User } from "lucide-react";

const ClassesSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [classes, setClasses] = useState<PublicModalidadeCard[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const expanded = classes.find((c) => c.id === expandedId);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const rows = await fetchPublicModalidadesAsCards();
        if (!mounted) return;
        setClasses(rows);
      } catch {
        if (!mounted) return;
        setClasses([]);
      }
    };
    void run();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (expandedId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [expandedId]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) setExpandedId(null);
  };

  const whatsappUrl = (_name: string) => "https://www.whatsapp.com/";

  return (
    <section id="aulas" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading title="Nossas Aulas" subtitle="Turmas para todas as idades, do primeiro plié ao grand jeté." />

        <div
          ref={ref}
          className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {classes.map((cls, i) => (
            <div
              key={cls.id}
              onClick={() => setExpandedId(cls.id)}
              className="bg-card rounded-2xl shadow-sm border border-border/30 overflow-hidden group cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-500 active:scale-[0.97]"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="h-56 overflow-hidden relative">
                <img
                  src={cls.image}
                  alt={cls.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-lg font-semibold text-foreground">{cls.name}</h3>
                <p className="text-sm text-muted-foreground mt-2">{cls.age}</p>
                <p className="text-xs text-muted-foreground/70 mt-1 tracking-wide">{cls.schedule}</p>
                <p className="text-xs text-primary/70 mt-3 font-medium tracking-wide">
                  Clique para detalhes ✦
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            onClick={() => navigate("/aulas")}
          >
            Ver todas as modalidades
          </Button>
        </div>
      </div>

      {/* Expanded card overlay */}
      {expanded && (
        <div
          ref={overlayRef}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm animate-in fade-in duration-300"
        >
          <div className="relative bg-card rounded-3xl shadow-2xl border border-border/20 w-full max-w-lg overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
            <button
              onClick={() => setExpandedId(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:bg-background transition-all duration-200"
            >
              <X size={18} />
            </button>

            <div className="h-48 overflow-hidden relative">
              <img src={expanded.image} alt={expanded.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
              <div className="absolute bottom-4 left-6">
                <h3 className="font-serif text-2xl font-bold text-primary-foreground drop-shadow-lg">
                  {expanded.name}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <User size={14} className="text-primary" /> {expanded.age}
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar size={14} className="text-primary" /> {expanded.days}
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock size={14} className="text-primary" /> {expanded.schedule}
                </span>
              </div>

              <div className="flex items-center gap-3 py-3 border-y border-border/30">
                  {expanded.teacherImage ? (
                    <img
                      src={expanded.teacherImage}
                      alt={expanded.teacher}
                      className="w-10 h-10 rounded-full object-cover shadow-sm"
                    />
                  ) : null}
                <div>
                  <p className="text-sm font-semibold text-foreground">{expanded.teacher}</p>
                  <p className="text-xs text-muted-foreground">Professora responsável</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {expanded.shortDescription}
              </p>

              <Button
                variant="enroll"
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(whatsappUrl(expanded.name), "_blank");
                }}
              >
                Agendar Aula Experimental
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ClassesSection;
