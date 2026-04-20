import { useEffect } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const { ref, isVisible } = useScrollReveal(0.12);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const PoliticaDePrivacidade = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    "A Ballet Academy Lumière Étoile utiliza este site com o objetivo de apresentar suas atividades, conteúdos institucionais, eventos e formas de contato.",
    "As informações eventualmente fornecidas pelos usuários, como nome, telefone ou mensagem enviada por meio de contato ou redirecionamento para WhatsApp, são utilizadas exclusivamente para comunicação relacionada às atividades da Ballet Academy Lumière Étoile.",
    "Nenhum dado pessoal é comercializado, compartilhado ou utilizado para finalidades externas.",
    "As imagens publicadas no site têm caráter institucional, artístico e informativo, relacionadas às atividades da Ballet Academy Lumière Étoile, apresentações, eventos e registros autorizados.",
    "O site pode utilizar recursos técnicos básicos para melhorar a navegação, desempenho e experiência do usuário.",
    "Ao navegar neste site, o usuário concorda com estas condições de utilização e tratamento das informações.",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background artístico */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-primary-light" />
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-foreground/[0.03] rounded-full blur-3xl" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <Reveal>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 tracking-tight">
              Política de Privacidade
            </h1>
          </Reveal>
          <Reveal delay={150}>
            <p className="text-primary-foreground/70 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
              Transparência, cuidado e respeito às informações de nossos visitantes.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="relative py-20 overflow-hidden">
        {/* Background decorativo sutil */}
        <div className="absolute top-20 -left-32 w-64 h-64 bg-primary/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-32 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />

        <div className="relative z-10 container mx-auto px-4 lg:px-8 max-w-3xl">
          <Reveal>
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/40 shadow-sm p-8 md:p-12 space-y-6">
              {sections.map((text, i) => (
                <Reveal key={i} delay={i * 80}>
                  <p className="text-muted-foreground text-base leading-relaxed text-justify">
                    {text}
                  </p>
                </Reveal>
              ))}

              <Reveal delay={sections.length * 80}>
                <p className="text-xs text-muted-foreground/50 pt-6 border-t border-border/30">
                  Última atualização: Março de 2026.
                </p>
              </Reveal>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PoliticaDePrivacidade;
