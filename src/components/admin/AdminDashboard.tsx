import { useEffect, useState } from "react";
import { FileText, Image, CalendarDays, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { fetchDashboardStats } from "@/lib/cms";

const AdminDashboard = () => {
  const [statsData, setStatsData] = useState({
    posts: 0,
    photos: 0,
    events: 0,
    modalidades: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const stats = await fetchDashboardStats();
        setStatsData(stats);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, []);

  const stats = [
    { label: "Posts publicados", value: statsData.posts, icon: FileText, color: "bg-primary/10 text-primary" },
    { label: "Fotos na galeria", value: statsData.photos, icon: Image, color: "bg-emerald-500/10 text-emerald-600" },
    { label: "Eventos cadastrados", value: statsData.events, icon: CalendarDays, color: "bg-amber-500/10 text-amber-600" },
    { label: "Modalidades", value: statsData.modalidades, icon: GraduationCap, color: "bg-violet-500/10 text-violet-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-1">Bem-vindo ao painel</h2>
        <p className="text-muted-foreground text-sm">Gerencie o conteúdo da Ballet Academy Lumière Étoile</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/30 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon size={22} />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/30 shadow-sm">
        <CardContent className="p-8 text-center">
          {loading ? (
            <p className="text-muted-foreground text-sm">Carregando dados do Supabase...</p>
          ) : (
            <p className="text-muted-foreground text-sm">
              Utilize o menu lateral para acessar os módulos de gestão do site.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
