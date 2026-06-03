"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-24 px-4 bg-background">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
        
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-primary/10 rounded-full mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading text-2xl font-bold">Admin Access</h1>
          <p className="text-muted-foreground text-sm mt-1">CaptureFlow Workspace</p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Admin Email</label>
            <input 
              type="email" 
              className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" 
              placeholder="admin@thecapturestudio.in" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Security Key</label>
            <input 
              type="password" 
              className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" 
              placeholder="••••••••" 
            />
          </div>

          <Button type="submit" className="w-full rounded-xl mt-6 h-12">
            Authenticate
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
