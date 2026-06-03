"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface P2PGalleryViewerProps {
  magnetUris: string[];
  fallbackUrls: string[];
}

export function P2PGalleryViewer({ magnetUris, fallbackUrls }: P2PGalleryViewerProps) {
  const [images, setImages] = useState<string[]>(Array(magnetUris.length).fill(""));
  const clientRef = useRef<any>(null);

  useEffect(() => {
    let activeClient: any = null;

    const initWebTorrent = async () => {
      // Initialize WebTorrent client
      // @ts-ignore
      const WebTorrent = (await import("webtorrent/dist/webtorrent.min.js")).default || (await import("webtorrent/dist/webtorrent.min.js"));
      clientRef.current = new WebTorrent();
      activeClient = clientRef.current;

    magnetUris.forEach((uri, index) => {
      clientRef.current.add(uri, (torrent: any) => {
        // Find the image file in the torrent
        const file = torrent.files.find((f: any) => f.name.match(/\.(jpg|jpeg|png|gif)$/i));
        
        if (file) {
          // Render the file into a blob URL
          file.getBlobURL((err: any, url: string) => {
            if (err) {
              console.error("Error generating blob URL", err);
              // Fallback to CDN
              updateImage(index, fallbackUrls[index]);
              return;
            }
            updateImage(index, url);
          });
        }
      });
    });
    };

    initWebTorrent();

    // Cleanup when component unmounts
    return () => {
      if (activeClient) {
        activeClient.destroy();
      }
    };
  }, [magnetUris, fallbackUrls]);

  const updateImage = (index: number, url: string) => {
    setImages(prev => {
      const newImages = [...prev];
      newImages[index] = url;
      return newImages;
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((src, index) => (
        <div key={index} className="relative aspect-square bg-muted rounded-xl overflow-hidden">
          {src ? (
            <Image src={src} alt={`Gallery image ${index + 1}`} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
