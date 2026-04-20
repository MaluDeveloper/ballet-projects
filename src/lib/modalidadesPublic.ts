import { fetchPublicModalidades, type CmsModalidade } from "@/lib/cms";

export type PublicModalidadeCard = {
  id: string;
  slug: string;
  name: string;
  age: string;
  schedule: string;
  days: string;
  image: string;
  teachers?: { name: string; image: string }[];
  teacher: string;
  teacherImage: string;
  shortDescription: string;
  fullDescription: string;
  objectives: string[];
  level: string;
  sessions?: { label: string; teacher?: string }[];
};

export const mapModalidadeToPublicCard = (m: CmsModalidade): PublicModalidadeCard => {
  const teachers = [
    ...(m.teacher?.trim()
      ? [{ name: m.teacher.trim(), image: m.teacher_image_url || "" }]
      : []),
    ...((m.teachers ?? [])
      .filter((t) => (t.name ?? "").trim())
      .map((t) => ({ name: t.name, image: t.image_url || "" }))),
  ];

  const objectives = (m.objectives ?? []).map((o) => (o.text ?? "").trim()).filter(Boolean);

  const sessions = (m.sessions ?? [])
    .filter((s) => (s.title ?? "").trim())
    // No CMS: salvamos `title` como "Horário" e `description` como "Professor(a)" (opcional)
    .map((s) => ({ label: s.title, teacher: (s.description ?? "").trim() || undefined }));

  return {
    id: m.slug || m.id,
    slug: m.slug || m.id,
    name: m.name || "Modalidade",
    age: m.age || "",
    schedule: m.schedule || "",
    days: m.days || "",
    image: m.image_url || "",
    teacher: m.teacher || "",
    teacherImage: m.teacher_image_url || "",
    shortDescription: (m.short_description || "").trim(),
    fullDescription: (m.full_description || "").trim(),
    objectives,
    level: (m.level || "").trim(),
    teachers: teachers.length ? teachers : undefined,
    sessions: sessions.length ? sessions : undefined,
  };
};

export const fetchPublicModalidadesAsCards = async () => {
  const rows = await fetchPublicModalidades();
  return rows.map(mapModalidadeToPublicCard);
};

