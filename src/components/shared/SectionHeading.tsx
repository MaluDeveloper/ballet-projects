interface SectionHeadingProps {
  title: string;
  subtitle: string;
  light?: boolean;
}

const SectionHeading = ({ title, subtitle, light }: SectionHeadingProps) => {
  return (
    <div
      className="text-center mb-16"
    >
      <div className="flex items-center justify-center gap-4 mb-6">
        <span className={`h-px w-12 ${light ? "bg-primary-foreground/30" : "bg-primary/30"}`} />
        <span className={`text-xs font-medium tracking-[0.3em] uppercase ${light ? "text-primary-foreground/60" : "text-primary/60"}`}>
          ✦
        </span>
        <span className={`h-px w-12 ${light ? "bg-primary-foreground/30" : "bg-primary/30"}`} />
      </div>
      <h2 className={`text-3xl md:text-4xl lg:text-5xl font-serif font-semibold mb-4 ${light ? "text-primary-foreground" : "text-foreground"}`}>
        {title}
      </h2>
      <p className={`max-w-2xl mx-auto leading-relaxed ${light ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
        {subtitle}
      </p>
    </div>
  );
};

export default SectionHeading;
