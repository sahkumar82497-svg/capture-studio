"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, UploadCloud, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getGalleries } from "@/app/actions/galleries";

export default function GalleryUploadPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [gallery, setGallery] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      const galleries = await getGalleries();
      const match = galleries.find((g: any) => g.id === id);
      setGallery(match || null);
      setLoading(false);
    }
    load();
  }, [id]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(`Uploading ${i + 1} of ${files.length}...`);

      try {
        // 1. Get presigned URL
        const res = await fetch('/api/upload/presignedUrl', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType: file.type })
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        // 2. Upload directly to Backblaze B2
        const uploadRes = await fetch(data.url, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type
          }
        });

        if (!uploadRes.ok) throw new Error("Failed to upload to B2");
        successCount++;
      } catch (err: any) {
        console.error("Upload error:", err);
        alert(`Failed to upload ${file.name}: ${err.message}`);
      }
    }

    setUploading(false);
    setUploadProgress("");
    if (successCount > 0) {
      alert(`Successfully uploaded ${successCount} photos directly to Backblaze B2 Storage!`);
    }
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (!gallery) return <div className="p-12 text-center">Gallery not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-border pb-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold font-heading">{gallery.name}</h1>
          <p className="text-muted-foreground text-sm">Upload and manage photos for this gallery.</p>
        </div>
      </div>

      <div className="bg-card border border-border border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <UploadCloud className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">Drag and drop photos here</h3>
        <p className="text-muted-foreground mb-6">Or click below to browse your files (Direct to Backblaze B2).</p>
        
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        
        <Button size="lg" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <ImageIcon className="w-5 h-5 mr-2" />}
          {uploading ? uploadProgress : "Select Photos"}
        </Button>
      </div>
    </div>
  );
}
