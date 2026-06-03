"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";

export function P2PUploader({ galleryId }: { galleryId: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const clientRef = useRef<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setIsUploading(true);
    setProgress(10);

    // 1. Initialize WebTorrent to start seeding immediately (P2P upload)
    if (!clientRef.current) {
      // @ts-ignore
      const WebTorrent = (await import("webtorrent/dist/webtorrent.min.js")).default;
      clientRef.current = new WebTorrent();
    }

    clientRef.current.seed(files, (torrent: any) => {
      console.log("Seeding started. Magnet URI:", torrent.magnetURI);
      
      // Here you would save the magnetURI to Supabase for this gallery
      // So other clients can start downloading P2P
    });

    setProgress(40);

    // 2. Upload to Backblaze B2 (origin server backup)
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Get presigned URL
        const res = await fetch("/api/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            fileName: `${galleryId}/${Date.now()}-${file.name}`,
            contentType: file.type 
          })
        });
        
        const { uploadUrl, cdnUrl } = await res.json();

        // Direct upload to B2
        await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file
        });

        // Trigger Face Indexing in AWS Rekognition
        const formData = new FormData();
        formData.append("image", file);
        formData.append("photoId", `photo_${Date.now()}`);
        
        await fetch("/api/face-index", {
          method: "POST",
          body: formData
        });

        setProgress(40 + Math.floor(((i + 1) / files.length) * 60));
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
      setProgress(100);
    }
  };

  return (
    <div className="border border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center bg-card/50">
      <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
      <h3 className="font-heading font-bold text-lg mb-2">Upload Gallery Photos</h3>
      <p className="text-muted-foreground text-sm text-center mb-6 max-w-sm">
        Photos will be backed up to Backblaze B2 and immediately seeded P2P to connected guests.
      </p>
      
      <input 
        type="file" 
        multiple 
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4 text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
      />

      <Button onClick={handleUpload} disabled={isUploading || files.length === 0} className="w-full max-w-xs">
        {isUploading ? `Uploading (${progress}%)` : `Upload ${files.length > 0 ? `${files.length} photos` : ""}`}
      </Button>
      
      {isUploading && (
        <div className="w-full max-w-xs h-2 bg-muted rounded-full mt-4 overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
