import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { fetchPublicModalidadesAsCards, type PublicModalidadeCard } from "@/lib/modalidadesPublic";
import { X, Calendar, Clock, User } from "lucide-react";

const ClassesSection = () => {
  const { ref, isVisible } = useScrollReveal(0.1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const navigate = useNavigate();

  const homeHighlights = ["ballet-adulto", "jazz-dance", "k-pop", "sapateado"];
  const [dynamicClasses, setDynamicClasses] = useState<PublicModalidadeCard[]>([]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const rows = await fetchPublicModalidadesAsCards();
        if (!mounted) return;
        setDynamicClasses(rows);
      } catch {
        if (!mounted) return;
        setDynamicClasses([]);
      }
    };
    void run();
    return () => { mounted = false; };
  }, []);

  const highlighted = dynamicClasses.filter((c) => homeHighlights.includes(c.id));
  const homeClasses = highlighted.length ? highlighted : dynamicClasses.slice(0, 4);
  const expanded = expandedId ? homeClasses.find((c) => c.id === expandedId) : undefined;

  const openExpanded = (id: string) => {
    setExpandedId(id);
  };

  const whatsappUrl = (_name: string) => "https://www.whatsapp.com/";

  return (
    <section
      id="aulas"
      ref={ref}
      className={`py-24 lg:py-32 bg-background transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading title="Nossas Aulas" subtitle="Turmas para todas as idades, do primeiro plié ao grand jeté." />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {homeClasses.map((cls, i) => (
            <div
              key={cls.id}
              className={`transition-all duration-700 ease-out ${
                isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-[0.98]"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div
                onClick={() => openExpanded(cls.id)}
                className="bg-card rounded-2xl shadow-sm border border-border/30 overflow-hidden group cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-500 active:scale-[0.97]"
              >
                <div className="h-56 overflow-hidden relative">
                  {cls.image ? (
                    <img
                      src={cls.image}
                      alt={cls.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  ) : null}
                  {!cls.image ? (
                    <div className="w-full h-full bg-muted" />
                  ) : null}
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

      {expanded && (
        (typeof document !== "undefined"
          ? createPortal(
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
              onClick={(e) => {
                if (e.target === e.currentTarget) setExpandedId(null);
              }}
            >
              <div className="absolute inset-0 bg-foreground/80 backdrop-blur-md pointer-events-none" />
              <button
                onClick={() => setExpandedId(null)}
                className="absolute top-6 right-6 z-10 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                aria-label="Fechar"
              >
                <X size={28} />
              </button>
              <div className="relative z-10 w-full max-w-lg mx-auto bg-card rounded-3xl shadow-2xl border border-border/20 overflow-hidden max-h-[80dvh]">
                <div className="h-44 overflow-hidden relative">
                  <img src={expanded.image} alt={expanded.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <h3 className="font-serif text-2xl font-bold text-primary-foreground drop-shadow-lg">
                      {expanded.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(80dvh-11rem)]">
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
                    {expanded.teachers?.length ? (
                      <>
                        <div className="flex -space-x-2">
                          {expanded.teachers.slice(0, 2).map((t) => (
                            <img
                              key={t.name}
                              src={t.image}
                              alt={t.name}
                              className="w-10 h-10 rounded-full object-cover shadow-sm border-2 border-card"
                            />
                          ))}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {expanded.teachers.slice(0, 2).map((t) => t.name).join(" • ")}
                          </p>
                          <p className="text-xs text-muted-foreground">Professor responsáveis</p>
                        </div>
                      </>
                    ) : (
                      <>
                        {expanded.teacherImage ? (
                          <img
                            src={expanded.teacherImage}
                            alt={expanded.teacher}
                            className="w-10 h-10 rounded-full object-cover shadow-sm"
                            onError={(e) => { e.currentTarget.style.display = "none"; }}
                          />
                        ) : null}
                        <div>
                          <p className="text-sm font-semibold text-foreground">{expanded.teacher}</p>
                          <p className="text-xs text-muted-foreground">Professor responsável</p>
                        </div>
                      </>
                    )}
                  </div>

                  {null}

                  <p className="text-sm text-muted-foreground leading-relaxed text-justify">
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
            </div>,
            document.body,
          )
          : null)
      )}
    </section>
  );
};

export default ClassesSection;
