import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlus, Trash2 } from "lucide-react";
import { deleteGalleryPhoto, fetchGalleryPhotos, type CmsGalleryPhoto, uploadGalleryPhoto } from "@/lib/cms";

const AdminGallery = () => {
  const [images, setImages] = useState<CmsGalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadPhotos = async () => {
    try {
      const data = await fetchGalleryPhotos();
      setImages(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPhotos();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadGalleryPhoto(file);
      }
      await loadPhotos();
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = async (photo: CmsGalleryPhoto) => {
    if (!confirm("Remover esta imagem?")) return;
    await deleteGalleryPhoto(photo);
    await loadPhotos();
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">{loading ? "Carregando..." : `${images.length} imagens`}</p>
        <label>
          <Button asChild className="rounded-full gap-2 cursor-pointer" disabled={uploading}>
            <span><ImagePlus size={16} /> {uploading ? "Enviando..." : "Upload"}</span>
          </Button>
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
        </label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {images.map((img, i) => (
          <Card key={img.id} className="border-border/30 shadow-sm group overflow-hidden">
            <CardContent className="p-0 relative">
              <img src={img.image_url} alt={`Imagem ${i + 1}`} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button onClick={() => void removeImage(img)} className="p-2 bg-destructive/90 rounded-lg hover:bg-destructive transition-colors">
                  <Trash2 size={16} className="text-white" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminGallery;
