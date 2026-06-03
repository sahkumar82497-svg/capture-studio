"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    const supabase = createClient();

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          throw new Error("Please enter your full name.");
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName.trim() }
          }
        });
        if (error) throw error;
        setSuccess("Account created successfully! You can now sign in.");
        setIsSignUp(false);
        setFullName("");
        setPassword("");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
        router.push("/client");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-4xl bg-card border border-border rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
        >
          {/* Branding Image Split */}
          <div className="hidden md:block md:w-1/2 relative bg-primary/10">
            <div className="absolute inset-0 bg-[url('/branding_bg2.jpg')] bg-cover bg-center opacity-80 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end p-8">
              <div>
                <Camera className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-3xl font-heading font-bold mb-2">Welcome to The Capture Studio</h3>
                <p className="text-muted-foreground">Access your premium gallery, manage your bookings, and relive your memories.</p>
              </div>
            </div>
          </div>

          {/* Form Split */}
          <div className="w-full md:w-1/2 p-8 md:p-12 relative flex flex-col justify-center">
            <button onClick={onClose} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl font-heading font-bold mb-2">{isSignUp ? "Create an Account" : "Client Portal"}</h2>
            <p className="text-muted-foreground mb-8">
              {isSignUp ? "Sign up to access your photo delivery and bookings." : "Log in to view your galleries and manage your sessions."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Your full name" 
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="name@example.com" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="••••••••" 
                />
              </div>

              {error && <p className="text-destructive text-sm font-medium">{error}</p>}
              {success && <p className="text-green-500 text-sm font-medium">{success}</p>}

              <Button type="submit" className="w-full rounded-xl mt-4 py-6 text-lg font-semibold" disabled={loading}>
                {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                {isSignUp ? "Sign Up" : "Sign In"}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <button 
                onClick={() => { setIsSignUp(!isSignUp); setError(null); setSuccess(null); }} 
                className="text-primary hover:underline font-semibold"
                type="button"
              >
                {isSignUp ? "Log in" : "Sign up"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
