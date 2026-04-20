import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus, Edit2, Trash2, ArrowLeft, Eye, Save, X, ImagePlus,
  User, Calendar, Clock, BarChart3, Target,
} from "lucide-react";
import {
  deleteModalidade,
  fetchAdminModalidades,
  fetchModalidadeByIdAdmin,
  type CmsModalidade,
  type CmsModalidadeObjective,
  type CmsModalidadeSession,
  type CmsModalidadeTeacher,
  type CmsModalidadeStatus,
  uploadModalidadeImage,
  uploadModalidadeTeacherImage,
  saveModalidade,
} from "@/lib/cms";

type View = "list" | "editor";

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const emptyTeacher = (): CmsModalidadeTeacher => ({
  name: "",
  role: "",
  bio: "",
  image_url: "",
});

const AdminModalidades = () => {
  const [view, setView] = useState<View>("list");
  const [modalidades, setModalidades] = useState<CmsModalidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Form fields
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [schedule, setSchedule] = useState("");
  const [days, setDays] = useState("");
  const [teacher, setTeacher] = useState("");
  const [level, setLevel] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [objectivesText, setObjectivesText] = useState("");
  const [image, setImage] = useState("");
  const [teacherImage, setTeacherImage] = useState("");
  const [pendingMainImage, setPendingMainImage] = useState<File | null>(null);
  const [pendingTeacherImage, setPendingTeacherImage] = useState<File | null>(null);

  // Professores adicionais (tabela filha)
  const [extraTeachers, setExtraTeachers] = useState<CmsModalidadeTeacher[]>([]);
  const [pendingExtraTeacherImages, setPendingExtraTeacherImages] = useState<(File | null)[]>([]);

  // Turmas & horários (sessions)
  const [sessions, setSessions] = useState<{ label: string; teacher?: string }[]>([]);

  const imageRef = useRef<string>("");
  const teacherImageRef = useRef<string>("");

  const revokeBlobUrl = (url: string) => {
    if (url.startsWith("blob:")) URL.revokeObjectURL(url);
  };

  useEffect(() => {
    imageRef.current = image;
  }, [image]);

  useEffect(() => {
    teacherImageRef.current = teacherImage;
  }, [teacherImage]);

  useEffect(() => {
    return () => {
      revokeBlobUrl(imageRef.current);
      revokeBlobUrl(teacherImageRef.current);
    };
  }, []);

  const computedSlug = useMemo(() => {
    const preferred = slug.trim();
    return toSlug(preferred || name);
  }, [slug, name]);

  const load = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const rows = await fetchAdminModalidades();
      setModalidades(rows);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Falha ao carregar modalidades.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const resetEditor = () => {
    setSaveError("");
    setName(""); setAge(""); setSchedule(""); setDays("");
    setTeacher(""); setLevel(""); setShortDescription("");
    setFullDescription(""); setObjectivesText(""); setImage("");
    setTeacherImage(""); setShowPreview(false); setEditingId(null);
    setSlug("");
    if (image) revokeBlobUrl(image);
    if (teacherImage) revokeBlobUrl(teacherImage);
    setPendingMainImage(null);
    setPendingTeacherImage(null);
    extraTeachers.forEach((t) => revokeBlobUrl(t.image_url || ""));
    setExtraTeachers([]);
    setPendingExtraTeacherImages([]);
    setSessions([]);
  };

  const openNew = () => { resetEditor(); setView("editor"); };

  const openEdit = async (row: CmsModalidade) => {
    setLoading(true);
    setLoadError("");
    try {
      const full = await fetchModalidadeByIdAdmin(row.id);
      resetEditor();
      setEditingId(full.id);
      setSlug(full.slug ?? "");
      setName(full.name ?? "");
      setAge(full.age ?? "");
      setSchedule(full.schedule ?? "");
      setDays(full.days ?? "");
      setTeacher(full.teacher ?? "");
      setLevel(full.level ?? "");
      setShortDescription(full.short_description ?? "");
      setFullDescription(full.full_description ?? "");
      setObjectivesText((full.objectives ?? []).map((o) => (o.text ?? "").trim()).filter(Boolean).join("\n"));
      setImage(full.image_url ?? "");
      setTeacherImage(full.teacher_image_url ?? "");
      setPendingMainImage(null);
      setPendingTeacherImage(null);
      const loadedTeachers = (full.teachers ?? [])
        .filter((t) => (t.name ?? "").trim())
        .map((t) => ({
          name: t.name ?? "",
          role: t.role ?? "",
          bio: t.bio ?? "",
          image_url: t.image_url ?? "",
        }));
      setExtraTeachers(loadedTeachers);
      setPendingExtraTeacherImages(loadedTeachers.map(() => null));
      setSessions(
        (full.sessions ?? [])
          .filter((s) => (s.title ?? "").trim())
          .map((s) => ({ label: s.title ?? "", teacher: (s.description ?? "").trim() || undefined })),
      );
      setShowPreview(false);
      setView("editor");
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Falha ao abrir modalidade.");
    } finally {
      setLoading(false);
    }
  };

  const addExtraTeacher = () => {
    setExtraTeachers((prev) => {
      if (prev.length >= 1) return prev; // no máximo 1 professor adicional
      return [...prev, emptyTeacher()];
    });
    setPendingExtraTeacherImages((prev) => {
      if (prev.length >= 1) return prev;
      return [...prev, null];
    });
  };

  const removeExtraTeacher = (index: number) => {
    setExtraTeachers((prev) => {
      const url = prev[index]?.image_url ?? "";
      revokeBlobUrl(url);
      return prev.filter((_, i) => i !== index);
    });
    setPendingExtraTeacherImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onExtraTeacherImageChange = (index: number, file: File) => {
    setExtraTeachers((prev) => {
      const next = [...prev];
      const prevUrl = next[index]?.image_url ?? "";
      revokeBlobUrl(prevUrl);
      next[index] = { ...(next[index] ?? emptyTeacher()), image_url: URL.createObjectURL(file) };
      return next;
    });
    setPendingExtraTeacherImages((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
  };

  const addSession = () => {
    setSessions((prev) => [...prev, { label: "", teacher: "" }]);
  };

  const removeSession = (index: number) => {
    setSessions((prev) => prev.filter((_, i) => i !== index));
  };

  const remove = async (id: string) => {
    if (!confirm("Excluir esta modalidade?")) return;
    try {
      await deleteModalidade(id);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Falha ao excluir modalidade.");
    }
  };

  const save = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const status: CmsModalidadeStatus = "published";

      const mainImageUrl = pendingMainImage
        ? await uploadModalidadeImage(pendingMainImage)
        : (image && !image.startsWith("blob:") ? image : "");

      const teacherImageUrl = pendingTeacherImage
        ? await uploadModalidadeTeacherImage(pendingTeacherImage)
        : (teacherImage && !teacherImage.startsWith("blob:") ? teacherImage : "");

      const payloadObjectives: CmsModalidadeObjective[] = objectivesText
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean)
        .map((text, idx) => ({ text, order_index: idx }));

      const extraTeacherImageUrls: string[] = [];
      for (let i = 0; i < extraTeachers.length; i += 1) {
        const t = extraTeachers[i];
        const pending = pendingExtraTeacherImages[i];
        if (pending) {
          extraTeacherImageUrls[i] = await uploadModalidadeTeacherImage(pending);
        } else {
          const existing = t?.image_url ?? "";
          extraTeacherImageUrls[i] = existing && !existing.startsWith("blob:") ? existing : "";
        }
      }

      const payloadTeachers: CmsModalidadeTeacher[] = extraTeachers
        .map((t, i) => ({
          name: t.name ?? "",
          role: t.role ?? "",
          bio: t.bio ?? "",
          image_url: extraTeacherImageUrls[i] ?? "",
        }))
        .filter((t) => t.name.trim());

      const payloadSessions: CmsModalidadeSession[] = sessions
        .map((s, idx) => ({
          title: (s.label ?? "").trim(),
          description: (s.teacher ?? "").trim(),
          order_index: idx,
        }))
        .filter((s) => s.title.trim());

      await saveModalidade({
        id: editingId ?? undefined,
        slug: computedSlug,
        name,
        age,
        schedule,
        days,
        image_url: mainImageUrl,
        teacher,
        teacher_image_url: teacherImageUrl,
        short_description: shortDescription,
        full_description: fullDescription,
        level,
        status,
        teachers: payloadTeachers,
        sessions: payloadSessions,
        objectives: payloadObjectives,
      });

      await load();
      resetEditor();
      setView("list");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Falha ao salvar modalidade.";
      if (message.includes("row-level security policy") || message.includes("42501")) {
        setSaveError("Sem permissão para salvar no Supabase (RLS). Ajuste as policies das tabelas de modalidades.");
      } else {
        setSaveError(message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (setter: (v: string) => void, fileSetter: (f: File | null) => void) =>
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setter(preview);
    fileSetter(file);
    e.target.value = "";
  };

  /* ── LIST VIEW ── */
  if (view === "list") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">{loading ? "Carregando..." : `${modalidades.length} modalidades`}</p>
          <Button onClick={openNew} className="rounded-full gap-2">
            <Plus size={16} /> Nova Modalidade
          </Button>
        </div>

        {loadError ? (
          <p className="text-sm text-destructive">{loadError}</p>
        ) : null}

        <div className="space-y-3">
          {modalidades.map((m) => (
            <Card key={m.id} className="border-border/30 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                {m.image_url && (
                  <img src={m.image_url} alt={m.name || ""} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 min-w-0">
                    <h3 className="font-medium text-sm text-foreground truncate">{m.name}</h3>
                    {m.level?.trim() ? (
                      <Badge variant="default" className="text-[10px] shrink-0">
                        {m.level}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {[m.age, m.days, m.schedule].filter((x) => (x ?? "").trim()).join(" · ")}
                  </p>
                  {(() => {
                    const primary = (m.teacher ?? "").trim();
                    const extra = Array.isArray(m.teachers)
                      ? m.teachers.map((t) => (t.name ?? "").trim()).filter(Boolean)
                      : [];
                    const names = [primary, ...extra].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).slice(0, 2);

                    if (names.length === 1) {
                      return (
                        <p className="text-xs text-muted-foreground/80 truncate mt-1">
                          <span className="text-[11px] text-muted-foreground/70">Prof.</span>{" "}
                          <span className="text-muted-foreground/60">·</span> {names[0]}
                        </p>
                      );
                    }

                    if (names.length === 2) {
                      return (
                        <p className="text-xs text-muted-foreground/80 truncate mt-1">
                          <span className="text-[11px] text-muted-foreground/70">Profs.</span>{" "}
                          <span className="text-muted-foreground/60">·</span> {names[0]} e {names[1]}
                        </p>
                      );
                    }
                    return null;
                  })()}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => void openEdit(m)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => void remove(m.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  /* ── PREVIEW ── */
  if (showPreview) {
    const objectives = objectivesText.split("\n").map(o => o.trim()).filter(Boolean);
    const hasSessions = sessions.some((s) => (s.label ?? "").trim());
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setShowPreview(false)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="font-serif text-xl font-semibold text-foreground">Preview</h2>
          <Button variant="outline" size="sm" className="rounded-full gap-2 ml-auto" onClick={() => setShowPreview(false)}>
            <Edit2 size={14} /> Voltar ao Editor
          </Button>
        </div>

        <Card className="border-border/30 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row gap-8 p-8 min-w-0">
              {image && (
                <div className="w-full lg:w-1/2 min-w-0">
                  <div className="rounded-2xl overflow-hidden shadow-lg max-w-full">
                    <img src={image} alt={name} className="w-full h-72 object-cover" />
                  </div>
                </div>
              )}
              <div className="w-full lg:w-1/2 space-y-5 min-w-0">
                <div className="min-w-0">
                  <h2 className="font-serif text-2xl font-bold text-foreground break-words [overflow-wrap:anywhere]">
                    {name || "Nome da Modalidade"}
                  </h2>
                  <p className="text-primary font-medium mt-1 text-sm break-words [overflow-wrap:anywhere]">
                    {level}
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm break-words [overflow-wrap:anywhere]">
                  {fullDescription || shortDescription}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><User size={14} className="text-primary" /> {age}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar size={14} className="text-primary" /> {days}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock size={14} className="text-primary" /> {schedule}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><BarChart3 size={14} className="text-primary" /> {level}</div>
                </div>
                {(() => {
                  const responsible = [
                    { name: teacher, image_url: teacherImage },
                    ...extraTeachers,
                  ].filter((t) => (t.name ?? "").trim());

                  if (responsible.length === 0) return null;

                  // Mesmo design da página de Aulas (professoras responsáveis)
                  if (responsible.length > 1) {
                    return (
                      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 p-4 sm:p-3.5 md:p-4 rounded-2xl bg-muted/50 border border-border/30 text-center sm:text-left">
                        <div className="w-full flex flex-col items-center md:items-start gap-3 min-w-0">
                          {responsible.slice(0, 2).map((t, idx) => (
                            <div key={`${t.name}-${idx}`} className="flex items-center gap-3 justify-center md:justify-start min-w-0">
                              {t.image_url ? (
                                <img
                                  src={t.image_url}
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
                      </div>
                    );
                  }

                  const only = responsible[0]!;
                  return (
                    <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 p-4 sm:p-3.5 md:p-4 rounded-2xl bg-muted/50 border border-border/30 text-center sm:text-left">
                      {only.image_url ? (
                        <img
                          src={only.image_url}
                          alt={only.name}
                          className="w-14 h-14 rounded-full object-cover shadow-md"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-muted shrink-0 border border-border/30" />
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground break-words [overflow-wrap:anywhere]">{only.name}</p>
                        <p className="text-xs text-muted-foreground">Professor Responsável</p>
                      </div>
                    </div>
                  );
                })()}
                {objectives.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                      <Target size={14} className="text-primary" /> Objetivos Pedagógicos
                    </h4>
                    <ul className="space-y-1.5">
                      {objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground min-w-0">
                          <span className="text-primary mt-0.5 text-xs">✦</span>
                          <span className="min-w-0 break-words [overflow-wrap:anywhere]">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {hasSessions ? (
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                      <Calendar size={14} className="text-primary" /> Turmas & horários
                    </h4>
                    <ul className="space-y-2">
                      {sessions
                        .filter((s) => (s.label ?? "").trim())
                        .map((s, i) => (
                          <li
                            key={`${s.label}-${i}`}
                            className="flex items-start justify-center lg:justify-start gap-2 text-sm text-muted-foreground leading-relaxed text-center lg:text-left"
                          >
                            <Clock size={14} className="text-primary shrink-0 mt-0.5" />
                            <span className="min-w-0 whitespace-normal break-words">
                              {s.label}
                              {s.teacher ? (
                                <>
                                  {" "}
                                  <span className="text-muted-foreground/60">—</span>{" "}
                                  <span className="inline-flex items-center gap-1.5">
                                    <User size={14} className="text-primary shrink-0" /> {s.teacher}
                                  </span>
                                </>
                              ) : null}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ── EDITOR VIEW ── */
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => { resetEditor(); setView("list"); }} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-serif text-xl font-semibold text-foreground">
          {editingId ? "Editar Modalidade" : "Nova Modalidade"}
        </h2>
        <Button variant="outline" size="sm" className="rounded-full gap-2 ml-auto" onClick={() => setShowPreview(true)}>
          <Eye size={14} /> Preview
        </Button>
      </div>

      {/* Images */}
      <Card className="border-border/30 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-3 mb-3">
            <label className="text-sm font-medium text-foreground block">Imagens</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full gap-2 h-7 px-3 text-xs"
              onClick={addExtraTeacher}
              disabled={extraTeachers.length >= 1}
              title={extraTeachers.length >= 1 ? "Limite: 1 outro professor" : "Adicionar outro professor"}
            >
              <Plus size={12} /> Adicionar outro professor
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Foto da Modalidade</p>
              {image ? (
                <div className="relative rounded-xl overflow-hidden group">
                  <img src={image} alt="" className="w-full h-36 object-cover" />
                  <button onClick={() => { revokeBlobUrl(image); setImage(""); setPendingMainImage(null); }} className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all">
                  <ImagePlus size={22} className="text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">Upload</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload(setImage, setPendingMainImage)} />
                </label>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Foto do Professor Responsável</p>
              {teacherImage ? (
                <div className="relative rounded-xl overflow-hidden group">
                  <img src={teacherImage} alt="" className="w-full h-36 object-cover" />
                  <button onClick={() => { revokeBlobUrl(teacherImage); setTeacherImage(""); setPendingTeacherImage(null); }} className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all">
                  <ImagePlus size={22} className="text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">Upload</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload(setTeacherImage, setPendingTeacherImage)} />
                </label>
              )}
            </div>
          </div>

          {extraTeachers.length > 0 ? (
            <div className="mt-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="hidden md:block" />
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Foto do Professor Responsável 2</p>
                  {extraTeachers[0]?.image_url ? (
                    <div className="relative rounded-xl overflow-hidden group">
                      <img src={extraTeachers[0].image_url} alt={extraTeachers[0].name || ""} className="w-full h-36 object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setExtraTeachers((prev) => {
                            const next = [...prev];
                            revokeBlobUrl(next[0]?.image_url ?? "");
                            next[0] = { ...(next[0] ?? emptyTeacher()), image_url: "" };
                            return next;
                          });
                          setPendingExtraTeacherImages((prev) => {
                            const next = [...prev];
                            next[0] = null;
                            return next;
                          });
                        }}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remover foto"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all">
                      <ImagePlus size={22} className="text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          onExtraTeacherImageChange(0, file);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Fields */}
      <Card className="border-border/30 shadow-sm">
        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Nome da Modalidade</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Baby Ballet" className="rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Faixa Etária</label>
              <Input value={age} onChange={(e) => setAge(e.target.value)} placeholder="Ex: 2 a 4 anos" className="rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Horário</label>
              <Input value={schedule} onChange={(e) => setSchedule(e.target.value)} placeholder="Ex: Sáb 9h – 10h" className="rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Dias da Semana</label>
              <Input value={days} onChange={(e) => setDays(e.target.value)} placeholder="Ex: Terça e Quinta" className="rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Professor Responsável</label>
              <Input value={teacher} onChange={(e) => setTeacher(e.target.value)} placeholder="Ex: Prof(a). Ana Carolina" className="rounded-xl" />
              {extraTeachers.length > 0 ? (
                <div className="mt-3">
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <label className="text-sm font-medium text-foreground block">Professor Responsável 2</label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive h-7 px-2"
                      onClick={() => removeExtraTeacher(0)}
                      title="Remover outro professor"
                    >
                      <Trash2 size={14} className="mr-2" /> Remover
                    </Button>
                  </div>
                  <Input
                    value={extraTeachers[0]?.name ?? ""}
                    onChange={(e) =>
                      setExtraTeachers((prev) => {
                        const next = [...prev];
                        next[0] = { ...(next[0] ?? emptyTeacher()), name: e.target.value };
                        return next;
                      })
                    }
                    placeholder="Nome do outro professor"
                    className="rounded-xl"
                  />
                </div>
              ) : null}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Nível</label>
              <Input value={level} onChange={(e) => setLevel(e.target.value)} placeholder="Ex: Iniciante" className="rounded-xl" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Descrição Curta</label>
            <Textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder="Resumo para os cards" rows={2} className="rounded-xl resize-none" />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Descrição Completa</label>
            <Textarea value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} placeholder="Descrição detalhada para a página de aulas" rows={4} className="rounded-xl resize-none" />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Objetivos Pedagógicos <span className="text-muted-foreground font-normal text-xs">(um por linha)</span>
            </label>
            <Textarea value={objectivesText} onChange={(e) => setObjectivesText(e.target.value)} placeholder={"Desenvolvimento da coordenação motora\nIntrodução à musicalidade"} rows={4} className="rounded-xl resize-none" />
          </div>

          <div className="pt-1">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div>
                <label className="text-sm font-medium text-foreground block">Turmas & horários</label>
                <p className="text-xs text-muted-foreground">Opcional. O site mostra essa lista na página de Aulas e nos detalhes.</p>
              </div>
              <Button type="button" variant="outline" size="sm" className="rounded-full gap-2" onClick={addSession}>
                <Plus size={14} /> Adicionar
              </Button>
            </div>

            {sessions.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nenhuma turma adicionada.</p>
            ) : (
              <div className="space-y-3">
                {sessions.map((s, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-border/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-2 block">Horário</label>
                        <Input
                          value={s.label ?? ""}
                          onChange={(e) => setSessions((prev) => prev.map((x, i) => i === idx ? { ...x, label: e.target.value } : x))}
                          className="rounded-xl"
                          placeholder='Ex: Terça e Quinta — 19h30'
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-2 block">Professor(a) (opcional)</label>
                        <Input
                          value={s.teacher ?? ""}
                          onChange={(e) => setSessions((prev) => prev.map((x, i) => i === idx ? { ...x, teacher: e.target.value } : x))}
                          className="rounded-xl"
                          placeholder="Ex: Prof(a). Ana Carolina"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeSession(idx)}
                      >
                        <Trash2 size={14} className="mr-2" /> Remover
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button variant="outline" className="rounded-full gap-2 flex-1 py-5" onClick={() => { resetEditor(); setView("list"); }}>
          Cancelar
        </Button>
        <Button variant="enroll" className="gap-2 flex-1 py-5" onClick={() => void save()} disabled={saving || !name.trim()}>
          <Save size={16} /> {editingId ? "Salvar Alterações" : "Criar Modalidade"}
        </Button>
      </div>
      {saveError ? (
        <p className="text-sm text-destructive">{saveError}</p>
      ) : null}
    </div>
  );
};

export default AdminModalidades;
