"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Search, UploadCloud, ShieldCheck, DownloadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function FaceSearchPage() {
  const [step, setStep] = useState<"initial" | "scanning" | "results">("initial");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setStep("scanning");
      
      // Simulate scanning process
      setTimeout(() => {
        setStep("results");
      }, 3500);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen pb-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <section className="pt-32 pb-12 px-4 md:px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 backdrop-blur-sm"
        >
          <Search className="mr-2 h-4 w-4" />
          AI-Powered Gallery Search
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-heading text-4xl md:text-6xl font-bold mb-6"
        >
          Find Your Photos <span className="text-primary italic font-serif">Instantly.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-lg max-w-xl mx-auto"
        >
          Upload a selfie to instantly search through thousands of event photos using our privacy-first facial recognition engine.
        </motion.p>
      </section>

      <section className="container mx-auto px-4 md:px-6 max-w-2xl relative z-10 flex-1">
        <AnimatePresence mode="wait">
          {step === "initial" && (
            <motion.div
              key="initial"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-card border border-border rounded-3xl p-8 shadow-2xl text-center"
            >
              <div className="border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-2xl p-12 flex flex-col items-center justify-center bg-muted/20 relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="user"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleUpload}
                />
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-xl mb-2">Take a Selfie or Upload</h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
                  Ensure your face is clearly visible and well-lit for the best search results.
                </p>
                <Button className="rounded-full px-8 pointer-events-none">
                  <UploadCloud className="w-4 h-4 mr-2" /> Upload Photo
                </Button>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Your photo is never stored. It is only used for temporary facial mapping.
              </div>
            </motion.div>
          )}

          {step === "scanning" && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-card border border-border rounded-3xl p-16 shadow-2xl flex flex-col items-center justify-center"
            >
              <div className="relative mb-8">
                <div className="w-32 h-32 rounded-full border-4 border-muted flex items-center justify-center overflow-hidden relative">
                  {selectedFile && (
                    <Image src={URL.createObjectURL(selectedFile)} alt="Selfie" fill className="object-cover opacity-50 grayscale" />
                  )}
                  {/* Scanner line animation */}
                  <motion.div 
                    initial={{ top: "-10%" }}
                    animate={{ top: "110%" }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_15px_rgba(var(--primary),1)] z-10"
                  />
                </div>
                
                {/* Orbital dots */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="absolute -inset-4 border border-dashed border-primary/30 rounded-full"
                />
              </div>
              
              <h3 className="font-heading font-bold text-2xl mb-2">Analyzing Face Map...</h3>
              <p className="text-muted-foreground text-sm">Searching across 12,450 event photos using AWS Rekognition</p>
              
              <div className="w-64 h-1.5 bg-muted rounded-full mt-8 overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3.5, ease: "easeInOut" }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </motion.div>
          )}

          {step === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-heading text-2xl font-bold">Search Results</h2>
                  <p className="text-muted-foreground">Found 42 photos matching your face.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setStep("initial")} className="rounded-full">
                  <Search className="w-4 h-4 mr-2" /> New Search
                </Button>
              </div>

              <div className="columns-2 md:columns-3 gap-4 space-y-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={`w-full ${i % 3 === 0 ? 'aspect-square' : 'aspect-[3/4]'} rounded-xl bg-muted relative group overflow-hidden border border-border/50`}
                  >
                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button size="icon" className="rounded-full w-12 h-12 bg-white/20 backdrop-blur-md border border-white/40 text-white hover:bg-white hover:text-black">
                        <DownloadCloud className="w-5 h-5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-center">
                <Button variant="outline" className="rounded-full px-8">Load More Results</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

