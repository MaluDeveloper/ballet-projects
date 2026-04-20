import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeroCarousel from "@/components/PageHeroCarousel";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { fetchPublicModalidadesAsCards, type PublicModalidadeCard } from "@/lib/modalidadesPublic";
import { Calendar, Clock, User, Target, BarChart3, MessageCircle } from "lucide-react";
import aulasHero1 from "@/assets/aulas-hero-1.jpg";
import aulasHero2 from "@/assets/aulas-hero-2.jpg";
import aulasHero3 from "@/assets/aulas-hero-3.jpg";
import { useEffect, useState } from "react";

const WHATSAPP_URL = "https://www.whatsapp.com/";

const ClassBlock = ({ cls, index }: { cls: PublicModalidadeCard; index: number }) => {
  const { ref, isVisible } = useScrollReveal(0.1);
  const isEven = index % 2 === 0;

  const whatsappUrl = WHATSAPP_URL;

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div
        className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-6 md:gap-8 lg:gap-10 xl:gap-16 items-center`}
      >
        <div className="w-full shrink-0 md:w-1/2 flex justify-center md:justify-start">
          <div className="w-full max-w-[34rem] sm:max-w-none">
            <div className="relative rounded-3xl overflow-hidden shadow-xl group w-full h-[280px] sm:h-[320px] md:h-[360px] lg:h-[420px] xl:h-[440px]">
              {cls.image ? (
                <img
                  src={cls.image}
                  alt={cls.name}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              ) : null}
              {!cls.image ? (
                <div className="w-full h-full bg-muted" />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 space-y-5 md:space-y-5 lg:space-y-6 text-center md:text-left max-w-[42rem] mx-auto md:mx-0">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-2xl lg:text-4xl font-bold text-foreground leading-tight tracking-tight">
              {cls.name}
            </h2>
            <p className="text-primary font-medium mt-2 tracking-wide text-xs sm:text-sm">{cls.level}</p>
          </div>
          <p className="text-muted-foreground text-sm sm:text-[0.9375rem] md:text-base leading-relaxed text-justify">
            {cls.fullDescription}
          </p>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="flex items-center justify-start gap-2.5 text-sm text-muted-foreground"><User size={16} className="text-primary shrink-0" /><span>{cls.age}</span></div>
            <div className="flex items-center justify-start gap-2.5 text-sm text-muted-foreground"><Calendar size={16} className="text-primary shrink-0" /><span>{cls.days}</span></div>
            <div className="flex items-center justify-start gap-2.5 text-sm text-muted-foreground"><Clock size={16} className="text-primary shrink-0" /><span>{cls.schedule}</span></div>
            <div className="flex items-center justify-start gap-2.5 text-sm text-muted-foreground"><BarChart3 size={16} className="text-primary shrink-0" /><span>{cls.level}</span></div>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 p-4 sm:p-3.5 md:p-4 rounded-2xl bg-muted/50 border border-border/30 text-center sm:text-left">
            {cls.teachers?.length ? (
              <div className="w-full flex flex-col items-center md:items-start gap-3 min-w-0">
                {cls.teachers.slice(0, 2).map((t, idx) => (
                  <div key={`${t.name}-${idx}`} className="flex items-center gap-3 justify-center md:justify-start min-w-0">
                    {t.image ? (
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shadow-md border-2 border-background shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-muted shrink-0 border border-border/30" />
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground leading-tight break-words [overflow-wrap:anywhere]">
                        {t.name}
                      </p>
                      <p className="text-xs text-muted-foreground">Professor Responsável</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <img src={cls.teacherImage} alt={cls.teacher} className="w-14 h-14 rounded-full object-cover shadow-md" />
                <div>
                  <p className="font-semibold text-foreground">{cls.teacher}</p>
                  <p className="text-xs text-muted-foreground">Professor responsável</p>
                </div>
              </>
            )}
          </div>
          <div>
            <h4 className="flex items-center justify-center lg:justify-start gap-2 text-sm font-semibold text-foreground mb-3">
              <Target size={15} className="text-primary" /> Objetivos Pedagógicos
            </h4>
            <ul className="space-y-2">
              {cls.objectives.map((obj) => (
                <li
                  key={obj}
                  className="flex items-start gap-2 text-sm text-muted-foreground justify-center md:justify-start text-center md:text-left"
                >
                  <span className="text-primary mt-1 text-xs">✦</span>{obj}
                </li>
              ))}
            </ul>
          </div>
          {cls.sessions?.length ? (
            <div>
              <h4 className="flex items-center justify-center lg:justify-start gap-2 text-sm font-semibold text-foreground mb-3">
                <Calendar size={15} className="text-primary" /> Turmas & horários
              </h4>
              <ul className="space-y-2">
                {cls.sessions.map((s) => (
                  <li
                    key={s.label}
                    className="flex items-start justify-center md:justify-start gap-2 text-sm text-muted-foreground leading-relaxed text-center md:text-left"
                  >
                    <Clock size={14} className="text-primary shrink-0 mt-0.5" />
                    <span className="min-w-0 whitespace-normal break-words">
                      <span className="inline-flex flex-wrap items-start gap-x-2 gap-y-1">
                        <span className="min-w-0 break-words">{s.label}</span>
                        {s.teacher ? (
                          <>
                            <span className="text-muted-foreground/60">—</span>
                            <span className="inline-flex items-center gap-1.5 min-w-0">
                              <User size={14} className="text-primary shrink-0" />
                              <span className="min-w-0 break-words">{s.teacher}</span>
                            </span>
                          </>
                        ) : null}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <Button variant="enroll" size="lg" className="w-full sm:w-auto mx-auto md:mx-0" onClick={() => window.open(whatsappUrl, "_blank")}>
            <MessageCircle size={16} /> Agendar Aula Experimental
          </Button>
        </div>
      </div>
    </div>
  );
};

const Aulas = () => {
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

  const aulasSlides = [
    { image: aulasHero1, title: "Formação artística com carinho", subtitle: "turmas para todas as idades, do baby ballet ao adulto." },
    { image: aulasHero2, title: "Cada turma, uma experiência única", subtitle: "com pedagogia dedicada e ambiente acolhedor." },
    { image: aulasHero3, title: "Disciplina, técnica e sensibilidade", subtitle: "no caminho da excelência em ballet clássico." },
  ];
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeroCarousel slides={aulasSlides} eyebrow="Modalidades" />

      {/* Classes */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-5 lg:px-8 space-y-20 md:space-y-24 lg:space-y-28 xl:space-y-32">
          {dynamicClasses.map((cls, i) => (
            <ClassBlock key={cls.id} cls={cls} index={i} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Aulas;
