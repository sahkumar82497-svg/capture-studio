"use client";

import { motion } from "framer-motion";
import { Camera, Home } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center py-24 px-4 bg-background">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-center flex flex-col items-center"
      >
        <div className="p-6 bg-primary/10 rounded-full mb-6">
          <Camera className="w-12 h-12 text-primary" />
        </div>
        
        <h1 className="font-heading text-6xl font-bold mb-4">404</h1>
        <h2 className="font-heading text-2xl font-bold mb-4">Page Not Found</h2>
        
        <p className="text-muted-foreground mb-8">
          Oops! The page or gallery you are looking for doesn&apos;t exist or might have been moved.
        </p>

        <Link href="/" className={buttonVariants({ size: "lg", className: "rounded-full" })}>
          <Home className="w-4 h-4 mr-2" /> Return to Homepage
        </Link>
      </motion.div>
    </div>
  );
}
