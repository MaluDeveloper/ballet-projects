import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Eye, Save, Send, ImagePlus, X, Plus, Edit2, Trash2, ArrowLeft, ChevronLeft, ChevronRight,
} from "lucide-react";
import {
  deletePost as deleteCmsPost,
  fetchAdminPosts,
  savePost as saveCmsPost,
  type CmsPost,
  uploadPostImage,
} from "@/lib/cms";
import RichTextEditor from "./RichTextEditor";
import { toSafeHtmlFromContent } from "@/lib/richText";

type View = "list" | "editor";

const AdminBlog = () => {
  const [view, setView] = useState<View>("list");
  const [posts, setPosts] = useState<CmsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewSlide, setPreviewSlide] = useState(0);
  const [pendingFiles, setPendingFiles] = useState<(File | null)[]>([]);
  const [saveError, setSaveError] = useState("");
  const [loadError, setLoadError] = useState("");
  const imagesRef = useRef<string[]>([]);

  const loadPosts = async () => {
    try {
      const data = await fetchAdminPosts();
      setPosts(data);
      setLoadError("");
    } catch (error: unknown) {
      const message = typeof error === "object" && error !== null && "message" in error
        ? String((error as { message?: string }).message)
        : "Falha ao carregar posts.";
      setLoadError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPosts();
  }, []);

  const revokeBlobUrls = (urls: string[]) => {
    for (const url of urls) {
      if (url.startsWith("blob:")) URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => revokeBlobUrls(imagesRef.current);
  }, []);

  const resetEditor = () => {
    revokeBlobUrls(images);
    setTitle(""); setSubtitle(""); setContent(""); setExcerpt("");
    setImages([]);
    setPendingFiles([]);
    setShowPreview(false);
    setEditingId(null);
    setPreviewSlide(0);
  };

  const openNew = () => { resetEditor(); setView("editor"); };

  const openEdit = (post: CmsPost) => {
    setEditingId(post.id);
    setTitle(post.title); setSubtitle(post.subtitle);
    setContent(post.content); setExcerpt(post.summary);
    revokeBlobUrls(images);
    const persistedImages = post.image_urls?.length
      ? post.image_urls
      : (post.image_url ? [post.image_url] : []);
    setImages(persistedImages);
    setPendingFiles(persistedImages.map(() => null));
    setPreviewSlide(0);
    setShowPreview(false); setView("editor");
  };

  const deletePost = async (id: string) => {
    if (!confirm("Excluir este post?")) return;
    await deleteCmsPost(id);
    await loadPosts();
  };

  const savePost = async (status: "published" | "draft") => {
    setSaving(true);
    setSaveError("");
    try {
      const imageUrls: string[] = [];
      for (let i = 0; i < images.length; i += 1) {
        const pendingFile = pendingFiles[i];
        if (pendingFile) {
          const uploadedUrl = await uploadPostImage(pendingFile);
          imageUrls.push(uploadedUrl);
          continue;
        }

        const existingUrl = images[i];
        if (existingUrl && !existingUrl.startsWith("blob:")) {
          imageUrls.push(existingUrl);
        }
      }

      const imageUrl = imageUrls[0] ?? "";

      await saveCmsPost({
        id: editingId ?? undefined,
        image_url: imageUrl,
        image_urls: imageUrls,
        title,
        subtitle,
        summary: excerpt,
        content,
        published: status === "published",
      });

      await loadPosts();
      resetEditor();
      setView("list");
    } catch (error: unknown) {
      const message = typeof error === "object" && error !== null && "message" in error
        ? String((error as { message?: string }).message)
        : "Falha ao salvar post.";

      if (message.includes("row-level security policy") || message.includes("42501")) {
        setSaveError("Sem permissao para salvar no Supabase (RLS). Ajuste as policies da tabela posts.");
      } else {
        setSaveError(message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newPreviews]);
    setPendingFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const toRemove = prev[index];
      if (toRemove?.startsWith("blob:")) URL.revokeObjectURL(toRemove);
      return prev.filter((_, i) => i !== index);
    });
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const today = new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });

  /* ── LIST VIEW ── */
  if (view === "list") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">{loading ? "Carregando..." : `${posts.length} posts`}</p>
          <Button onClick={openNew} className="rounded-full gap-2">
            <Plus size={16} /> Novo Post
          </Button>
        </div>

        <div className="space-y-3">
          {loadError && (
            <p className="text-sm text-destructive">{loadError}</p>
          )}
          {posts.map((post) => (
            <Card key={post.id} className="border-border/30 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                {post.image_url && (
                  <img src={post.image_url} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm text-foreground truncate">{post.title}</h3>
                    <Badge variant={post.published ? "default" : "secondary"} className="text-[10px] shrink-0">
                      {post.published ? "Publicado" : "Rascunho"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {post.created_at
                      ? new Date(post.created_at).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      : "Sem data"}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEdit(post)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => deletePost(post.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
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

  /* ── EDITOR VIEW ── */
  return (
    <div className="space-y-6 min-w-0 w-full max-w-6xl mx-auto overflow-hidden px-2 sm:px-3 md:px-4">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button onClick={() => { resetEditor(); setView("list"); }} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-serif text-lg sm:text-xl font-semibold text-foreground break-words">
          {editingId ? "Editar Post" : "Novo Post"}
        </h2>
        <div className="ml-auto">
          <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={() => setShowPreview(!showPreview)}>
            <Eye size={14} /> {showPreview ? "Editar" : "Preview"}
          </Button>
        </div>
      </div>

      {showPreview ? (
        <Card className="border-border/30 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            {images.length > 0 && (
              <div className="flex justify-center p-4 sm:p-6 md:p-8 pb-0">
                <div className="rounded-2xl overflow-hidden shadow-lg max-w-2xl w-full relative">
                  <img src={images[previewSlide] || images[0]} alt="Preview" className="w-full h-auto object-contain" />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setPreviewSlide((s) => (s - 1 + images.length) % images.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition-colors"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={() => setPreviewSlide((s) => (s + 1) % images.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition-colors"
                      >
                        <ChevronRight size={18} />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, i) => (
                          <button key={i} onClick={() => setPreviewSlide(i)} className={`w-2 h-2 rounded-full transition-colors ${i === previewSlide ? "bg-white" : "bg-white/50"}`} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            <div className="p-5 sm:p-6 md:p-10 max-w-3xl mx-auto min-w-0 overflow-hidden">
              <p className="text-xs text-muted-foreground mb-6">{today}</p>

              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-4 break-words [overflow-wrap:anywhere]">
                {title || "Título do Post"}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 sm:mb-10 font-light break-words [overflow-wrap:anywhere]">
                {subtitle || "Subtitulo do post"}
              </p>

              <div
                className="prose prose-lg max-w-none text-foreground/85 leading-[1.85] whitespace-pre-line [&_*]:whitespace-pre-line 
                  prose-headings:font-serif prose-headings:text-foreground prose-headings:mt-10 prose-headings:mb-4
                  prose-p:my-0 prose-p:whitespace-pre-line
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-ul:my-6 prose-li:my-1 prose-li:whitespace-pre-line
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  break-words [overflow-wrap:anywhere]"
                dangerouslySetInnerHTML={{ __html: content ? toSafeHtmlFromContent(content) : "<p>O conteudo aparecera aqui...</p>" }}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Images - unified upload */}
          <Card className="border-border/30 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <label className="text-sm font-medium text-foreground mb-3 block">
                Imagens <span className="text-muted-foreground font-normal text-xs">(a primeira será a imagem principal)</span>
              </label>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Imagem principal</p>
                  {images[0] ? (
                    <div className="relative rounded-xl overflow-hidden group">
                      <img src={images[0]} alt="" className="w-full h-36 object-cover" />
                      <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-medium">
                        Principal
                      </span>
                      <button
                        type="button"
                        onClick={() => removeImage(0)}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remover imagem principal"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all">
                      <ImagePlus size={22} className="text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-xs text-muted-foreground">Imagens adicionais (opcional)</p>
                    <label className="text-xs text-primary cursor-pointer hover:underline">
                      Adicionar
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>

                  {images.length <= 1 ? (
                    <p className="text-xs text-muted-foreground/70">Nenhuma imagem adicional.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {images.slice(1).map((img, idx) => {
                        const i = idx + 1;
                        return (
                          <div key={i} className="relative rounded-xl overflow-hidden group">
                            <img src={img} alt="" className="w-full h-36 object-cover object-center" />
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Remover imagem"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fields */}
          <Card className="border-border/30 shadow-sm min-w-0 max-w-4xl mx-auto w-full">
            <CardContent className="p-5 md:p-6 space-y-5 min-w-0 overflow-hidden box-border">
              <div className="min-w-0">
                <label className="text-sm font-medium text-foreground mb-1.5 block">Título</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título principal" className="rounded-xl font-serif text-lg w-full box-border focus-visible:ring-1 focus-visible:ring-border focus-visible:ring-offset-0" style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }} />
              </div>
              <div className="min-w-0">
                <label className="text-sm font-medium text-foreground mb-1.5 block">Subtítulo</label>
                <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Linha de apoio" className="rounded-xl w-full box-border focus-visible:ring-1 focus-visible:ring-border focus-visible:ring-offset-0" style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }} />
              </div>
              <div className="min-w-0">
                <label className="text-sm font-medium text-foreground mb-1.5 block">Resumo</label>
                <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Resumo para os cards" rows={2} className="rounded-xl resize-none w-full box-border focus-visible:ring-1 focus-visible:ring-border focus-visible:ring-offset-0" style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }} />
              </div>
              <div className="min-w-0">
                <label className="text-sm font-medium text-foreground mb-3 block">Conteúdo</label>
                <RichTextEditor content={content} onChange={setContent} />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button variant="outline" className="rounded-full gap-2 flex-1 py-5" onClick={() => void savePost("draft")} disabled={saving || !title.trim()}>
              <Save size={16} /> {saving ? "Salvando..." : "Salvar Rascunho"}
            </Button>
            <Button variant="enroll" className="gap-2 flex-1 py-5" onClick={() => void savePost("published")} disabled={saving || !title.trim()}>
              <Send size={16} /> {saving ? "Publicando..." : "Publicar"}
            </Button>
          </div>
          {saveError && (
            <p className="text-sm text-destructive">{saveError}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBlog;
