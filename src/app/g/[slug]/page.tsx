"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share2, Search, ArrowLeft, Heart, ImageIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { P2PUploader } from "@/components/gallery/P2PUploader";

export default function GalleryPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Highlights");

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Gallery link copied to clipboard!");
  };

  const handleDownloadAll = () => {
    alert("Preparing high-resolution zip file for download...");
  };
  
  return (
    <div className="flex flex-col w-full min-h-screen pb-24 bg-muted/10">
      {/* Gallery Header Cover */}
      <div className="relative h-[40vh] min-h-[300px] w-full bg-primary/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10" />
        {/* Placeholder Cover Image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-50 grayscale" />
        
        <div className="absolute top-6 left-6 z-20">
          <Link href="/client" className={buttonVariants({ variant: "outline", size: "sm", className: "rounded-full bg-background/50 backdrop-blur-md border-border/50" })}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
        </div>

        <div className="absolute bottom-6 left-6 md:left-12 z-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-3xl md:text-5xl font-bold mb-2 text-foreground"
          >
            Swarjit & Priya Wedding
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground flex items-center gap-4"
          >
            <span>15 May 2026</span>
            <span>•</span>
            <span>1,240 Photos</span>
          </motion.p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 md:px-12 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {["Highlights", "Haldi", "Sangeet", "Wedding", "Reception"].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === tab ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="hidden md:flex items-center gap-3 pl-4">
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => router.push('/search')}>
            <Search className="w-4 h-4 mr-2" /> Face Search
          </Button>
          <Button variant="outline" size="sm" className="rounded-full" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
          <Button size="sm" className="rounded-full" onClick={handleDownloadAll}>
            <Download className="w-4 h-4 mr-2" /> Download All
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 md:px-12 py-8">
        {/* P2P Upload Section (Admin Only in real app) */}
        <div className="mb-12">
          <P2PUploader galleryId={params.slug as string || "demo-gallery"} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4"
          >
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.div
                key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className={`w-full ${i % 4 === 0 ? 'aspect-square' : i % 3 === 0 ? 'aspect-video' : 'aspect-[3/4]'} rounded-xl bg-muted relative group overflow-hidden border border-border/50`}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                <ImageIcon className="w-8 h-8 opacity-20 mb-2" />
                <span className="text-xs opacity-50">Photo {i+1}</span>
              </div>
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                <div className="flex justify-end">
                  <button className="w-8 h-8 rounded-full bg-background/20 backdrop-blur flex items-center justify-center hover:bg-white text-white hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/80 font-medium">IMG_{8402 + i}.JPG</span>
                  <button className="w-8 h-8 rounded-full bg-background/20 backdrop-blur flex items-center justify-center hover:bg-white text-white hover:text-black transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          </motion.div>
        </AnimatePresence>
        
        <div className="mt-12 flex justify-center">
          <Button variant="outline" className="rounded-full px-8">Load More</Button>
        </div>
      </div>
    </div>
  );
}
