import { useEffect, useState } from "react";
import { MapPin, Clock, Calendar } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { fetchEvents, type CmsEvent } from "@/lib/cms";

const EventsSection = () => {
  const { ref, isVisible } = useScrollReveal(0.1);
  const [events, setEvents] = useState<CmsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const data = await fetchEvents();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = data.filter((e) => {
          const eventDate = new Date(`${e.event_date}T12:00:00`);
          return !Number.isNaN(eventDate.getTime()) && eventDate >= today;
        });

        // If all events are in the past, still show the latest ones instead of hiding section.
        setEvents((upcoming.length > 0 ? upcoming : data).slice(0, 6));
        setError("");
      } catch (err: unknown) {
        const message = typeof err === "object" && err !== null && "message" in err
          ? String((err as { message?: string }).message)
          : "Falha ao carregar eventos.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso + "T12:00:00");
    const day = String(d.getDate());
    const month = d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
    return { day, month };
  };

  const formatFullDate = (iso: string) => {
    const d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <section
      ref={ref}
      className={`py-24 lg:py-32 bg-background transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading title="Próximos Eventos" subtitle="Confira nossa agenda de apresentações e eventos especiais." />

        {loading && (
          <p className="text-center text-sm text-muted-foreground">Carregando eventos...</p>
        )}

        {!loading && error && (
          <p className="text-center text-sm text-destructive">{error}</p>
        )}

        {!loading && !error && events.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">Nenhum evento disponível no momento.</p>
        )}

        {!loading && !error && events.length > 0 && (
        <div className="max-w-3xl mx-auto space-y-6">
          {events.map((event, i) => {
            const { day, month } = formatDate(event.event_date);
            return (
              <div
                key={event.id}
                className={`transition-all duration-700 ease-out ${
                  isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-[0.98]"
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div
                  className="flex gap-6 bg-card rounded-2xl border border-border/30 p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-primary/15 to-primary/5 rounded-2xl flex flex-col items-center justify-center border border-primary/10">
                    <span className="text-[10px] text-primary font-semibold uppercase tracking-wider">
                      {month}
                    </span>
                    <span className="text-2xl font-serif font-bold text-primary">
                      {day}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {event.short_description}
                    </p>
                    <div className="flex flex-wrap gap-5 mt-3 text-xs text-muted-foreground/70">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={12} /> {event.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} /> {formatFullDate(event.event_date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} /> {event.event_time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
