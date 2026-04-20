import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export type CmsPost = {
  id: string;
  image_url: string;
  image_urls: string[];
  title: string;
  subtitle: string;
  summary: string;
  content: string;
  published: boolean;
  created_at?: string;
};

export type CmsEvent = {
  id: string;
  title: string;
  event_date: string;
  event_time: string;
  location: string;
  short_description: string;
};

export type CmsGalleryPhoto = {
  id: string;
  image_url: string;
  created_at?: string;
};

export type CmsModalidadeStatus = "draft" | "published";

export type CmsModalidadeTeacher = {
  id?: string;
  modalidade_id?: string;
  name: string;
  role?: string;
  bio?: string;
  image_url: string;
};

export type CmsModalidadeSession = {
  id?: string;
  modalidade_id?: string;
  title: string;
  description: string;
  order_index: number;
};

export type CmsModalidadeObjective = {
  id?: string;
  modalidade_id?: string;
  text: string;
  order_index: number;
};

export type CmsModalidade = {
  id: string;
  slug: string;
  name: string;
  age: string;
  schedule: string;
  days: string;
  image_url: string;
  teacher: string;
  teacher_image_url: string;
  short_description: string;
  full_description: string;
  level: string;
  status: CmsModalidadeStatus;
  created_at?: string;
  updated_at?: string;
  teachers?: CmsModalidadeTeacher[];
  sessions?: CmsModalidadeSession[];
  objectives?: CmsModalidadeObjective[];
};

const isMissingImageUrlsColumnError = (error: unknown) => {
  if (!error || typeof error !== "object") return false;
  const maybeCode = "code" in error ? String((error as { code?: string }).code ?? "") : "";
  const maybeMessage = "message" in error ? String((error as { message?: string }).message ?? "") : "";
  return maybeCode === "42703" || maybeMessage.includes("image_urls");
};

const isAdminByMetadata = (user: User) => {
  const role = String(user.app_metadata?.role ?? "").toLowerCase();
  const userMarkedAdmin = Boolean(user.user_metadata?.is_admin);
  return role === "admin" || userMarkedAdmin;
};

const normalizePost = (row: Partial<CmsPost> & { id: string }): CmsPost => ({
  id: row.id,
  image_url: row.image_url ?? "",
  image_urls: Array.isArray(row.image_urls)
    ? row.image_urls.filter((url): url is string => typeof url === "string" && Boolean(url))
    : (row.image_url ? [row.image_url] : []),
  title: row.title ?? "",
  subtitle: row.subtitle ?? "",
  summary: row.summary ?? "",
  content: row.content ?? "",
  published: Boolean(row.published),
  created_at: row.created_at ?? "",
});

export const makePostSlug = (post: Pick<CmsPost, "id" | "title">) =>
  `${post.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${post.id.slice(0, 8)}`;

export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

export const signInAsAdmin = async (email: string, password: string) => {
  const login = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (login.error || !login.data.user) {
    throw login.error ?? new Error("Falha ao autenticar.");
  }

  const isAdmin = await checkIsAdmin(login.data.user);
  if (!isAdmin) {
    await supabase.auth.signOut();
    throw new Error("Usuario sem permissao de administrador. Verifique perfis/is_admin.");
  }

  return login.data.session;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const checkIsAdmin = async (user: User) => {
  if (isAdminByMetadata(user)) return true;

  const { data, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data?.is_admin);
};

export const fetchAdminPosts = async () => {
  const withImages = await supabase
    .from("posts")
    .select("id,image_url,image_urls,title,subtitle,summary,content,published,created_at")
    .order("created_at", { ascending: false });

  if (!withImages.error) {
    return (withImages.data ?? []).map((row) => normalizePost(row as CmsPost));
  }

  if (!isMissingImageUrlsColumnError(withImages.error)) {
    throw withImages.error;
  }

  const fallback = await supabase
    .from("posts")
    .select("id,image_url,title,subtitle,summary,content,published,created_at")
    .order("created_at", { ascending: false });

  if (fallback.error) throw fallback.error;
  return (fallback.data ?? []).map((row) => normalizePost(row as CmsPost));
};

export const fetchPublicPosts = async () => {
  const withImages = await supabase
    .from("posts")
    .select("id,image_url,image_urls,title,subtitle,summary,content,published,created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (!withImages.error) {
    return (withImages.data ?? []).map((row) => normalizePost(row as CmsPost));
  }

  if (!isMissingImageUrlsColumnError(withImages.error)) {
    throw withImages.error;
  }

  const fallback = await supabase
    .from("posts")
    .select("id,image_url,title,subtitle,summary,content,published,created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (fallback.error) throw fallback.error;
  return (fallback.data ?? []).map((row) => normalizePost(row as CmsPost));
};

export const savePost = async (payload: Omit<CmsPost, "id"> & { id?: string }) => {
  if (payload.id) {
    const withImages = await supabase
      .from("posts")
      .update({
        image_url: payload.image_url,
        image_urls: payload.image_urls,
        title: payload.title,
        subtitle: payload.subtitle,
        summary: payload.summary,
        content: payload.content,
        published: payload.published,
      })
      .eq("id", payload.id);

    if (!withImages.error) return payload.id;

    if (!isMissingImageUrlsColumnError(withImages.error)) {
      throw withImages.error;
    }

    const fallback = await supabase
      .from("posts")
      .update({
        image_url: payload.image_url,
        title: payload.title,
        subtitle: payload.subtitle,
        summary: payload.summary,
        content: payload.content,
        published: payload.published,
      })
      .eq("id", payload.id);

    if (fallback.error) throw fallback.error;
    return payload.id;
  }

  const withImages = await supabase
    .from("posts")
    .insert({
      image_url: payload.image_url,
      image_urls: payload.image_urls,
      title: payload.title,
      subtitle: payload.subtitle,
      summary: payload.summary,
      content: payload.content,
      published: payload.published,
    })
    .select("id")
    .single();

  if (!withImages.error) return withImages.data.id as string;

  if (!isMissingImageUrlsColumnError(withImages.error)) {
    throw withImages.error;
  }

  const fallback = await supabase
    .from("posts")
    .insert({
      image_url: payload.image_url,
      title: payload.title,
      subtitle: payload.subtitle,
      summary: payload.summary,
      content: payload.content,
      published: payload.published,
    })
    .select("id")
    .single();

  if (fallback.error) throw fallback.error;
  return fallback.data.id as string;
};

export const deletePost = async (id: string) => {
  let post: { image_url?: string; image_urls?: string[] } | null = null;

  const withImages = await supabase
    .from("posts")
    .select("image_url,image_urls")
    .eq("id", id)
    .maybeSingle();

  if (!withImages.error) {
    post = withImages.data as { image_url?: string; image_urls?: string[] } | null;
  } else if (isMissingImageUrlsColumnError(withImages.error)) {
    const fallback = await supabase
      .from("posts")
      .select("image_url")
      .eq("id", id)
      .maybeSingle();

    if (fallback.error) throw fallback.error;
    post = fallback.data as { image_url?: string } | null;
  } else {
    throw withImages.error;
  }

  const imageUrls = [
    ...(Array.isArray(post?.image_urls) ? post.image_urls : []),
    ...(post?.image_url ? [post.image_url as string] : []),
  ];

  const paths = Array.from(new Set(
    imageUrls
      .map((url) => toStoragePathFromPublicUrl(url))
      .filter((path): path is string => Boolean(path)),
  ));

  if (paths.length > 0) {
    const storageDelete = await supabase.storage.from("media").remove(paths);
    if (storageDelete.error) throw storageDelete.error;
  }

  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
};

export const fetchEvents = async () => {
  const { data, error } = await supabase
    .from("events")
    .select("id,title,event_date,event_time,location,short_description")
    .order("event_date", { ascending: true });

  if (error) throw error;
  return (data ?? []) as CmsEvent[];
};

export const saveEvent = async (payload: Omit<CmsEvent, "id"> & { id?: string }) => {
  if (payload.id) {
    const { error } = await supabase
      .from("events")
      .update({
        title: payload.title,
        event_date: payload.event_date,
        event_time: payload.event_time,
        location: payload.location,
        short_description: payload.short_description,
      })
      .eq("id", payload.id);

    if (error) throw error;
    return payload.id;
  }

  const { data, error } = await supabase
    .from("events")
    .insert({
      title: payload.title,
      event_date: payload.event_date,
      event_time: payload.event_time,
      location: payload.location,
      short_description: payload.short_description,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
};

export const deleteEvent = async (id: string) => {
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw error;
};

export const fetchGalleryPhotos = async () => {
  const withCreatedAt = await supabase
    .from("gallery_photos")
    .select("id,image_url,created_at")
    .order("created_at", { ascending: false });

  if (!withCreatedAt.error) return (withCreatedAt.data ?? []) as CmsGalleryPhoto[];

  // Fallback for older schemas without created_at ordering
  const fallback = await supabase
    .from("gallery_photos")
    .select("id,image_url")
    .order("id", { ascending: false });

  if (fallback.error) throw fallback.error;
  return (fallback.data ?? []) as CmsGalleryPhoto[];
};

const toStoragePathFromPublicUrl = (url: string) => {
  const marker = "/object/public/media/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  const encoded = url.slice(idx + marker.length);
  return decodeURIComponent(encoded);
};

export const uploadGalleryPhoto = async (file: File) => {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `gallery/${Date.now()}-${safeName}`;

  const upload = await supabase.storage.from("media").upload(path, file, {
    upsert: false,
    cacheControl: "3600",
  });

  if (upload.error) throw upload.error;

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  const imageUrl = data.publicUrl;

  const { data: row, error } = await supabase
    .from("gallery_photos")
    .insert({ image_url: imageUrl })
    .select("id,image_url")
    .single();

  if (error) throw error;
  return row as CmsGalleryPhoto;
};

export const uploadPostImage = async (file: File) => {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `posts/${Date.now()}-${safeName}`;

  const upload = await supabase.storage.from("media").upload(path, file, {
    upsert: false,
    cacheControl: "3600",
  });

  if (upload.error) throw upload.error;

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
};

export const uploadModalidadeImage = async (file: File) => {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `modalidades/main/${Date.now()}-${safeName}`;

  const upload = await supabase.storage.from("media").upload(path, file, {
    upsert: false,
    cacheControl: "3600",
  });

  if (upload.error) throw upload.error;
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
};

export const uploadModalidadeTeacherImage = async (file: File) => {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `modalidades/teachers/${Date.now()}-${safeName}`;

  const upload = await supabase.storage.from("media").upload(path, file, {
    upsert: false,
    cacheControl: "3600",
  });

  if (upload.error) throw upload.error;
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
};

export const deleteGalleryPhoto = async (photo: CmsGalleryPhoto) => {
  const path = toStoragePathFromPublicUrl(photo.image_url);
  if (path) {
    const storageDelete = await supabase.storage.from("media").remove([path]);
    if (storageDelete.error) throw storageDelete.error;
  }

  const { error } = await supabase.from("gallery_photos").delete().eq("id", photo.id);
  if (error) throw error;
};

export const fetchDashboardStats = async () => {
  const [posts, photos, events, modalidades] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("gallery_photos").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("modalidades").select("*", { count: "exact", head: true }),
  ]);

  if (posts.error) throw posts.error;
  if (photos.error) throw photos.error;
  if (events.error) throw events.error;
  if (modalidades.error) throw modalidades.error;

  return {
    posts: posts.count ?? 0,
    photos: photos.count ?? 0,
    events: events.count ?? 0,
    modalidades: modalidades.count ?? 0,
  };
};

const normalizeModalidadeStatus = (value: unknown): CmsModalidadeStatus =>
  value === "published" ? "published" : "draft";

export const makeModalidadeSlug = (payload: Pick<CmsModalidade, "name" | "slug"> & { id?: string }) => {
  const preferred = (payload.slug ?? "").trim();
  const base = (preferred || payload.name || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base || "modalidade"}`;
};

const sortByOrderIndex = <T extends { order_index?: number }>(items: T[]) =>
  [...items].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

const isMissingTableError = (error: unknown) => {
  if (!error || typeof error !== "object") return false;
  const maybeCode = "code" in error ? String((error as { code?: string }).code ?? "") : "";
  const maybeMessage = "message" in error ? String((error as { message?: string }).message ?? "") : "";
  // Postgres: undefined_table = 42P01
  return maybeCode === "42P01" || maybeMessage.toLowerCase().includes("does not exist");
};

export const fetchAdminModalidades = async () => {
  const { data, error } = await supabase
    .from("modalidades")
    .select(`
      id,slug,name,age,schedule,days,image_url,teacher,teacher_image_url,short_description,full_description,level,status,created_at,updated_at,
      teachers:modalidade_teachers(id,modalidade_id,name,role,bio,image_url)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => ({
    ...(row as Omit<CmsModalidade, "status">),
    status: normalizeModalidadeStatus((row as { status?: unknown }).status),
  })) as CmsModalidade[];
};

export const fetchModalidadeByIdAdmin = async (id: string) => {
  const { data, error } = await supabase
    .from("modalidades")
    .select("id,slug,name,age,schedule,days,image_url,teacher,teacher_image_url,short_description,full_description,level,status,created_at,updated_at")
    .eq("id", id)
    .single();

  if (error) throw error;
  const base = {
    ...(data as Omit<CmsModalidade, "status">),
    status: normalizeModalidadeStatus((data as { status?: unknown }).status),
  } as CmsModalidade;

  // Tabelas filhas (opcionais). Se não existirem ainda, não quebrar.
  const [teachers, sessions, objectives] = await Promise.all([
    supabase.from("modalidade_teachers").select("id,modalidade_id,name,role,bio,image_url").eq("modalidade_id", id).order("id", { ascending: true }),
    supabase.from("modalidade_sessions").select("id,modalidade_id,title,description,order_index").eq("modalidade_id", id).order("order_index", { ascending: true }),
    supabase.from("modalidade_objectives").select("id,modalidade_id,text,order_index").eq("modalidade_id", id).order("order_index", { ascending: true }),
  ]);

  if (teachers.error && !isMissingTableError(teachers.error)) throw teachers.error;
  if (sessions.error && !isMissingTableError(sessions.error)) throw sessions.error;
  if (objectives.error && !isMissingTableError(objectives.error)) throw objectives.error;

  return {
    ...base,
    teachers: teachers.error ? [] : ((teachers.data ?? []) as CmsModalidadeTeacher[]),
    sessions: sessions.error ? [] : sortByOrderIndex((sessions.data ?? []) as CmsModalidadeSession[]),
    objectives: objectives.error ? [] : sortByOrderIndex((objectives.data ?? []) as CmsModalidadeObjective[]),
  };
};

export const fetchPublicModalidades = async () => {
  const { data, error } = await supabase
    .from("modalidades")
    .select("id,slug,name,age,schedule,days,image_url,teacher,teacher_image_url,short_description,full_description,level,status,created_at,updated_at")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw error;
  const rows = (data ?? []).map((row) => ({
    ...(row as Omit<CmsModalidade, "status">),
    status: normalizeModalidadeStatus((row as { status?: unknown }).status),
  })) as CmsModalidade[];

  // Tabelas filhas (opcionais)
  const ids = rows.map((r) => r.id).filter(Boolean);
  if (ids.length === 0) return rows;

  const [teachers, sessions, objectives] = await Promise.all([
    supabase.from("modalidade_teachers").select("id,modalidade_id,name,role,bio,image_url").in("modalidade_id", ids),
    supabase.from("modalidade_sessions").select("id,modalidade_id,title,description,order_index").in("modalidade_id", ids),
    supabase.from("modalidade_objectives").select("id,modalidade_id,text,order_index").in("modalidade_id", ids),
  ]);

  if (teachers.error && !isMissingTableError(teachers.error)) throw teachers.error;
  if (sessions.error && !isMissingTableError(sessions.error)) throw sessions.error;
  if (objectives.error && !isMissingTableError(objectives.error)) throw objectives.error;

  const teachersBy = new Map<string, CmsModalidadeTeacher[]>();
  if (!teachers.error) {
    for (const t of (teachers.data ?? []) as CmsModalidadeTeacher[]) {
      const key = String(t.modalidade_id ?? "");
      if (!teachersBy.has(key)) teachersBy.set(key, []);
      teachersBy.get(key)!.push(t);
    }
  }

  const sessionsBy = new Map<string, CmsModalidadeSession[]>();
  if (!sessions.error) {
    for (const s of (sessions.data ?? []) as CmsModalidadeSession[]) {
      const key = String(s.modalidade_id ?? "");
      if (!sessionsBy.has(key)) sessionsBy.set(key, []);
      sessionsBy.get(key)!.push(s);
    }
  }

  const objectivesBy = new Map<string, CmsModalidadeObjective[]>();
  if (!objectives.error) {
    for (const o of (objectives.data ?? []) as CmsModalidadeObjective[]) {
      const key = String(o.modalidade_id ?? "");
      if (!objectivesBy.has(key)) objectivesBy.set(key, []);
      objectivesBy.get(key)!.push(o);
    }
  }

  return rows.map((m) => ({
    ...m,
    teachers: teachersBy.get(m.id) ?? [],
    sessions: sortByOrderIndex(sessionsBy.get(m.id) ?? []),
    objectives: sortByOrderIndex(objectivesBy.get(m.id) ?? []),
  }));
};

export const saveModalidade = async (payload: Omit<CmsModalidade, "id" | "created_at" | "updated_at"> & { id?: string }) => {
  const baseRow = {
    slug: payload.slug,
    name: payload.name,
    age: payload.age,
    schedule: payload.schedule,
    days: payload.days,
    image_url: payload.image_url,
    teacher: payload.teacher,
    teacher_image_url: payload.teacher_image_url,
    short_description: payload.short_description,
    full_description: payload.full_description,
    level: payload.level,
    status: payload.status,
  };

  let modalidadeId = payload.id ?? "";

  if (payload.id) {
    const { error } = await supabase.from("modalidades").update(baseRow).eq("id", payload.id);
    if (error) throw error;
    modalidadeId = payload.id;
  } else {
    const { data, error } = await supabase.from("modalidades").insert(baseRow).select("id").single();
    if (error) throw error;
    modalidadeId = String((data as { id?: unknown }).id ?? "");
  }

  // Filhas (opcional): se tabelas existirem, sincroniza
  const teachers = (payload.teachers ?? []).filter((t) => (t.name ?? "").trim());
  const sessions = (payload.sessions ?? []).filter((s) => (s.title ?? "").trim());
  const objectives = (payload.objectives ?? []).filter((o) => (o.text ?? "").trim());

  const [delTeachers, delSessions, delObjectives] = await Promise.all([
    supabase.from("modalidade_teachers").delete().eq("modalidade_id", modalidadeId),
    supabase.from("modalidade_sessions").delete().eq("modalidade_id", modalidadeId),
    supabase.from("modalidade_objectives").delete().eq("modalidade_id", modalidadeId),
  ]);

  if (delTeachers.error && !isMissingTableError(delTeachers.error)) throw delTeachers.error;
  if (delSessions.error && !isMissingTableError(delSessions.error)) throw delSessions.error;
  if (delObjectives.error && !isMissingTableError(delObjectives.error)) throw delObjectives.error;

  if (teachers.length) {
    const ins = await supabase.from("modalidade_teachers").insert(
      teachers.map((t) => ({
        modalidade_id: modalidadeId,
        name: t.name,
        role: t.role ?? "",
        bio: t.bio ?? "",
        image_url: t.image_url,
      })),
    );
    if (ins.error && !isMissingTableError(ins.error)) throw ins.error;
  }

  if (sessions.length) {
    const ins = await supabase.from("modalidade_sessions").insert(
      sessions.map((s, idx) => ({
        modalidade_id: modalidadeId,
        title: s.title,
        description: s.description ?? "",
        order_index: Number.isFinite(s.order_index) ? s.order_index : idx,
      })),
    );
    if (ins.error && !isMissingTableError(ins.error)) throw ins.error;
  }

  if (objectives.length) {
    const ins = await supabase.from("modalidade_objectives").insert(
      objectives.map((o, idx) => ({
        modalidade_id: modalidadeId,
        text: o.text,
        order_index: Number.isFinite(o.order_index) ? o.order_index : idx,
      })),
    );
    if (ins.error && !isMissingTableError(ins.error)) throw ins.error;
  }

  return modalidadeId;
};

export const deleteModalidade = async (id: string) => {
  const [modalidadeRow, teachers] = await Promise.all([
    supabase.from("modalidades").select("image_url,teacher_image_url").eq("id", id).maybeSingle(),
    supabase.from("modalidade_teachers").select("image_url").eq("modalidade_id", id),
  ]);
  if (modalidadeRow.error) throw modalidadeRow.error;
  if (teachers.error && !isMissingTableError(teachers.error)) throw teachers.error;

  const imageUrls = [
    ...(modalidadeRow.data?.image_url ? [String(modalidadeRow.data.image_url)] : []),
    ...(modalidadeRow.data?.teacher_image_url ? [String(modalidadeRow.data.teacher_image_url)] : []),
    ...(!teachers.error ? (teachers.data ?? []).map((t) => String((t as { image_url?: unknown }).image_url ?? "")).filter(Boolean) : []),
  ].filter(Boolean);

  const paths = Array.from(new Set(
    imageUrls
      .map((url) => toStoragePathFromPublicUrl(url))
      .filter((path): path is string => Boolean(path)),
  ));

  if (paths.length > 0) {
    const storageDelete = await supabase.storage.from("media").remove(paths);
    if (storageDelete.error) throw storageDelete.error;
  }

  const [delTeachers, delSessions, delObjectives] = await Promise.all([
    supabase.from("modalidade_teachers").delete().eq("modalidade_id", id),
    supabase.from("modalidade_sessions").delete().eq("modalidade_id", id),
    supabase.from("modalidade_objectives").delete().eq("modalidade_id", id),
  ]);
  if (delTeachers.error && !isMissingTableError(delTeachers.error)) throw delTeachers.error;
  if (delSessions.error && !isMissingTableError(delSessions.error)) throw delSessions.error;
  if (delObjectives.error && !isMissingTableError(delObjectives.error)) throw delObjectives.error;

  const { error } = await supabase.from("modalidades").delete().eq("id", id);
  if (error) throw error;
};
