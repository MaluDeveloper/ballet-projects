import { useScrollReveal } from "@/hooks/useScrollReveal";
import SectionHeading from "@/components/SectionHeading";

import PageHeroCarousel from "@/components/PageHeroCarousel";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, Star, Award, Sparkles, BookOpen, Users } from "lucide-react";

import historiaHero1 from "@/assets/historia-hero-1.jpg";
import historiaHero2 from "@/assets/historia-hero-2.jpg";
import historiaHero3 from "@/assets/historia-hero-3.jpg";
import founderImg from "@/assets/teacher-adulto.jpg";
import directorYlse from "@/assets/director-ylse.jpg";
import directorNeide from "@/assets/director-neide.jpg";
import historyGallery1 from "@/assets/history-gallery-1.jpg";
import historyGallery2 from "@/assets/history-gallery-2.jpg";
import historyGallery3 from "@/assets/history-gallery-3.jpg";

const Reveal = ({
  children,
  className = "",
  delay = 0,
  isVisible,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  isVisible: boolean;
}) => {
  return (
    <div
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const ValueCard = ({
  icon: Icon,
  title,
  text,
  delay,
  isVisible,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
  delay: number;
  isVisible: boolean;
}) => {
  return (
    <div
      className={`group bg-card rounded-2xl p-8 shadow-sm border border-border/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors duration-300">
        <Icon size={22} className="text-primary" />
      </div>
      <h4 className="font-serif text-lg font-semibold text-foreground mb-2">{title}</h4>
      <p className="text-muted-foreground text-sm leading-relaxed">{text}</p>
    </div>
  );
};

const PersonCard = ({
  image, name, role, text, delay,
  isVisible,
}: {
  image: string; name: string; role: string; text: string; delay: number;
  isVisible: boolean;
}) => {
  return (
    <div
      className={`flex flex-col items-center text-center transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative mb-6 group">
        <div className="w-52 h-52 md:w-60 md:h-60 rounded-full overflow-hidden shadow-xl border-4 border-primary-foreground/20">
          <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary-foreground text-primary text-xs tracking-widest uppercase px-4 py-1 rounded-full shadow-md font-semibold">
          {role}
        </div>
      </div>
      <h3 className="font-serif text-2xl font-semibold text-foreground mb-3">{name}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">{text}</p>
    </div>
  );
};

const NossaHistoria = () => {
  const historiaSlides = [
    { image: historiaHero1, title: "Uma trajetória de arte e dedicação", subtitle: "que atravessa gerações com sensibilidade e beleza." },
    { image: historiaHero2, title: "Legado, memória e tradição", subtitle: "formando bailarinas com amor desde a fundação." },
    { image: historiaHero3, title: "Cada passo conta uma história", subtitle: "de disciplina, paixão e elegância no ballet clássico." },
  ];

  const { ref: aboutRef, isVisible: aboutVisible } = useScrollReveal(0.1);
  const { ref: founderRef, isVisible: founderVisible } = useScrollReveal(0.1);
  const { ref: directorsRef, isVisible: directorsVisible } = useScrollReveal(0.1);
  const { ref: momentsRef, isVisible: momentsVisible } = useScrollReveal(0.1);
  const { ref: valuesRef, isVisible: valuesVisible } = useScrollReveal(0.1);
  const { ref: missionRef, isVisible: missionVisible } = useScrollReveal(0.1);
  const { ref: cultureRef, isVisible: cultureVisible } = useScrollReveal(0.1);

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHeroCarousel slides={historiaSlides} eyebrow="Tradição & Arte" />

      {/* ═══════════ SOBRE A ESCOLA ═══════════ */}
      <section
        ref={aboutRef}
        className={`relative py-24 lg:py-32 bg-gradient-to-b from-primary/[0.06] via-primary/[0.03] to-background transition-all duration-700 ease-out ${
          aboutVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <SectionHeading title="Sobre a Escola" subtitle="Tradição, excelência e paixão pela dança desde a fundação." />
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Reveal isVisible={aboutVisible}>
              <div className="space-y-6 text-muted-foreground leading-relaxed text-justify">
                <p>
                  A <strong className="text-foreground">Ballet Academy Lumière Étoile</strong> nasceu em João Pessoa como um espaço dedicado à formação artística com delicadeza, rigor técnico e acolhimento. Desde os primeiros anos, a escola se destacou por unir metodologia consistente, musicalidade e cuidado com a evolução individual de cada aluno.
                </p>
                <p>
                  Com turmas organizadas por faixas etárias e níveis, oferecemos um percurso que vai da iniciação lúdica ao aperfeiçoamento sempre com foco em postura, coordenação, expressão e consciência corporal. As aulas são pensadas para que a técnica caminhe junto da confiança, criando um ambiente onde disciplina e alegria coexistem.
                </p>
                <p>
                  Ao longo do tempo, a escola consolidou uma cultura de palco: mostras internas, apresentações temáticas e projetos especiais que celebram a arte e o trabalho coletivo. Mais do que formar bailarinos, a Ballet Academy Lumière Étoile busca formar pessoas sensíveis, determinadas e apaixonadas pelo que fazem.
                </p>
              </div>
            </Reveal>
            <Reveal isVisible={aboutVisible} delay={200}>
              <div className="rounded-2xl overflow-hidden shadow-xl group">
                <img src={historyGallery1} alt="Aula de ballet" className="w-full h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════ FUNDADORA ═══════════ */}
      <section
        ref={founderRef}
        className={`py-24 lg:py-32 bg-gradient-to-b from-accent/60 via-primary/[0.08] to-primary/[0.04] transition-all duration-700 ease-out ${
          founderVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading title="A Fundadora" subtitle="A visão de quem transformou paixão em escola — e escola em legado." />
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Reveal isVisible={founderVisible}>
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="w-full max-w-[20rem] sm:max-w-[22rem] h-[22rem] sm:h-[24rem] md:max-w-[24rem] md:h-[28rem] rounded-2xl overflow-hidden shadow-xl border-4 border-accent">
                    <img src={founderImg} alt="Ana Carolina" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-full shadow-lg">
                    <span className="text-sm font-medium tracking-wide">Fundadora</span>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal isVisible={founderVisible} delay={200}>
              <div>
                <h3 className="font-serif text-3xl font-semibold text-foreground mb-6">Ana Carolina</h3>
                <div className="space-y-5 text-muted-foreground leading-relaxed text-justify">
                  <p>Ana Carolina começou a dançar ainda criança e, cedo, percebeu que seu caminho seria ensinar. Entre ensaios, estudos e temporadas de formação fora do estado, amadureceu uma ideia simples: criar uma escola onde a técnica fosse tratada com seriedade, mas onde cada aluno se sentisse visto e apoiado.</p>
                  <p>Ao fundar a Ballet Academy Lumière Étoile, Ana Carolina trouxe uma abordagem que combina base clássica sólida, atenção à musicalidade e um olhar pedagógico cuidadoso. Sua forma de orientar valorizava repetição consciente, correções gentis e o entendimento do “porquê” de cada movimento.</p>
                  <p>Com o tempo, sua liderança transformou a escola em um ponto de encontro para quem busca arte e disciplina. Projetos cênicos, oficinas e apresentações passaram a fazer parte do calendário, criando experiências que fortalecem autoestima, responsabilidade e trabalho em equipe.</p>
                  <p>Hoje, a trajetória de Ana Carolina segue presente em cada detalhe: na sala preparada para receber diferentes níveis, no cuidado com a formação humana e no compromisso de celebrar a dança como linguagem de expressão e de vida.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════ DIRETORAS ═══════════ */}
      <section
        ref={directorsRef}
        className={`py-24 lg:py-32 bg-gradient-to-b from-primary/[0.05] via-accent/40 to-primary/[0.03] transition-all duration-700 ease-out ${
          directorsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading
            title="Continuidade & Legado"
            subtitle="Ao longo dos anos, novas lideranças deram continuidade ao projeto, preservando a essência e renovando o olhar para cada geração."
          />
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24 max-w-4xl mx-auto">
            <PersonCard
              isVisible={directorsVisible}
              image={directorYlse}
              name="Helena Duarte"
              role="Diretora Artística"
              text="Helena Duarte conduz a direção artística com foco em repertório, qualidade técnica e construção de palco. Seu trabalho equilibra tradição e criatividade, trazendo montagens que desenvolvem interpretação, presença cênica e musicalidade."
              delay={0}
            />
            <PersonCard
              isVisible={directorsVisible}
              image={directorNeide}
              name="Beatriz Moreau"
              role="Diretora Pedagógica"
              text="Beatriz Moreau coordena o percurso pedagógico da escola, acompanhando turmas, professores e evolução dos alunos. Sua atuação fortalece a consistência do método e garante um ambiente acolhedor, organizado e inspirador."
              delay={150}
            />
          </div>
        </div>
      </section>

      {/* ═══════════ GALERIA ═══════════ */}
      <section
        ref={momentsRef}
        className={`py-24 lg:py-32 bg-gradient-to-b from-accent/50 via-primary/[0.06] to-accent/30 transition-all duration-700 ease-out ${
          momentsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading title="Momentos" subtitle="Fragmentos de arte, beleza e dedicação ao longo da nossa história." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[historyGallery1, historyGallery2, historyGallery3].map((src, i) => {
              const alts = ["Aulas no estúdio", "Apresentação no palco", "Sapatilhas de ballet"];
              return (
                <Reveal key={i} isVisible={momentsVisible} delay={i * 120}>
                  <div className="rounded-2xl overflow-hidden shadow-md group cursor-pointer relative aspect-[4/3]">
                    <img src={src} alt={alts[i]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/15 transition-colors duration-500" />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ VALORES ═══════════ */}
      <section
        ref={valuesRef}
        className={`relative py-24 lg:py-32 bg-gradient-to-b from-primary/[0.07] via-accent/50 to-primary/[0.04] transition-all duration-700 ease-out ${
          valuesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <SectionHeading title="Nossos Valores" subtitle="Os pilares que sustentam nossa missão e guiam cada passo no estúdio." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ValueCard isVisible={valuesVisible} icon={Award} title="Disciplina" text="A base de toda grande arte. Cultivamos a disciplina como caminho para a superação e a excelência." delay={0} />
            <ValueCard isVisible={valuesVisible} icon={Heart} title="Sensibilidade" text="Valorizamos a expressão emocional e a capacidade de transmitir sentimentos através do movimento." delay={100} />
            <ValueCard isVisible={valuesVisible} icon={Star} title="Excelência" text="Buscamos o mais alto padrão em cada detalhe, da técnica à expressão artística." delay={200} />
            <ValueCard isVisible={valuesVisible} icon={Sparkles} title="Arte" text="O ballet como forma sublime de expressão artística, conectando corpo, mente e alma." delay={300} />
            <ValueCard isVisible={valuesVisible} icon={BookOpen} title="Dedicação" text="Compromisso contínuo com o aprendizado, o crescimento pessoal e a evolução técnica." delay={400} />
            <ValueCard isVisible={valuesVisible} icon={Users} title="Formação Humana" text="Mais que bailarinos, formamos pessoas sensíveis, resilientes e apaixonadas pela vida." delay={500} />
          </div>
        </div>
      </section>

      {/* ═══════════ MISSÃO ═══════════ */}
      <section
        ref={missionRef}
        className={`py-24 lg:py-32 bg-gradient-to-b from-primary/[0.08] via-accent/50 to-primary/[0.04] transition-all duration-700 ease-out ${
          missionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-3xl">
          <Reveal isVisible={missionVisible}>
            <SectionHeading title="Nossa Missão" subtitle="" />
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Promover a formação artística e pessoal de nossos alunos através da dança, cultivando disciplina, sensibilidade e excelência em um ambiente acolhedor e profissional.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ CULTURA & IDENTIDADE ═══════════ */}
      <section
        ref={cultureRef}
        className={`py-24 lg:py-32 bg-gradient-to-b from-accent/40 via-primary/[0.03] to-background transition-all duration-700 ease-out ${
          cultureVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading title="Cultura & Identidade" subtitle="Tradição, elegância e compromisso com o ballet clássico em cada detalhe." />
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Reveal isVisible={cultureVisible} delay={200}>
              <div className="rounded-2xl overflow-hidden shadow-xl group">
                <img src={historyGallery2} alt="Apresentação de ballet" className="w-full h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            </Reveal>
            <Reveal isVisible={cultureVisible}>
              <div className="space-y-6 text-muted-foreground leading-relaxed text-justify">
                <p>
                  A cultura da Ballet Academy Lumière Étoile é feita de pequenos rituais: a barra bem preparada, o silêncio antes da música começar, o cuidado com o uniforme e o respeito pelo tempo de cada corpo. Acreditamos que excelência nasce da constância e que constância se constrói com orientação, clareza e carinho.
                </p>
                <p>
                  Nossa identidade valoriza técnica, elegância e expressão. Incentivamos a curiosidade artística, o estudo do repertório e a formação integral, para que o aluno entenda a dança como linguagem não apenas como sequência de passos.
                </p>
                <p>
                  Ao mesmo tempo, a escola se renova: atualiza processos, aprimora métodos e abre espaço para novas experiências cênicas, sem perder a base clássica que sustenta tudo. Assim, cada geração encontra aqui um lugar para crescer, pertencer e brilhar.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NossaHistoria;