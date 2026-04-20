import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { deleteEvent, fetchEvents, saveEvent, type CmsEvent } from "@/lib/cms";

const emptyEvent: Omit<CmsEvent, "id"> = {
  title: "",
  event_date: "",
  event_time: "",
  short_description: "",
  location: "",
};

const AdminEvents = () => {
  const [events, setEvents] = useState<CmsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyEvent);

  const loadEvents = async () => {
    try {
      const data = await fetchEvents();
      setEvents(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadEvents();
  }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyEvent);
    setDialogOpen(true);
  };

  const openEdit = (ev: CmsEvent) => {
    setEditingId(ev.id);
    setForm({
      title: ev.title,
      event_date: ev.event_date,
      event_time: ev.event_time,
      short_description: ev.short_description,
      location: ev.location,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.event_date) return;
    setSaving(true);
    try {
      await saveEvent({ id: editingId ?? undefined, ...form });
      await loadEvents();
      setDialogOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteEvent(id);
    await loadEvents();
  };

  const sorted = [...events].sort((a, b) => a.event_date.localeCompare(b.event_date));
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-foreground">Eventos</h2>
          <p className="text-muted-foreground text-sm mt-1">Gerencie a agenda de eventos e apresentacoes.</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus size={16} /> Novo Evento
        </Button>
      </div>

      {sorted.length === 0 && (
        <Card className="border-border/30">
          <CardContent className="p-12 text-center text-muted-foreground text-sm">
            {loading ? "Carregando eventos..." : "Nenhum evento cadastrado."}
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {sorted.map((ev) => {
          const isPast = ev.event_date < today;
          return (
            <Card key={ev.id} className={`border-border/30 shadow-sm transition-shadow hover:shadow-md ${isPast ? "opacity-50" : ""}`}>
              <CardContent className="p-5 flex items-start gap-5">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-primary/10 flex flex-col items-center justify-center">
                  <Calendar size={14} className="text-primary mb-0.5" />
                  <span className="text-xs font-semibold text-primary">{new Date(ev.event_date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-semibold text-foreground truncate">{ev.title}</h3>
                    {isPast && <span className="text-[10px] uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Passado</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{ev.short_description}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">{ev.location} · {new Date(ev.event_date + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })} · {ev.event_time}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(ev)} className="text-muted-foreground hover:text-primary">
                    <Pencil size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => void handleDelete(ev.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">{editingId ? "Editar Evento" : "Novo Evento"}</DialogTitle>
            <DialogDescription>
              Preencha as informações do evento. Os campos obrigatórios são título e data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>Título</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Nome do evento" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Data</Label>
                <Input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} />
              </div>
              <div>
                <Label>Horário</Label>
                <Input value={form.event_time} onChange={(e) => setForm({ ...form, event_time: e.target.value })} placeholder="19h30" />
              </div>
            </div>
            <div>
              <Label>Local</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Nome do local" />
            </div>
            <div>
              <Label>Descrição curta</Label>
              <Textarea value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} placeholder="Breve descricao do evento" rows={3} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={() => void handleSave()} disabled={saving || !form.title.trim() || !form.event_date}>
                {saving ? "Salvando..." : editingId ? "Salvar" : "Criar Evento"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEvents;
