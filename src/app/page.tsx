"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Star, Camera, Film, Users, Image as ImageIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0 bg-background">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-primary/20 rounded-full blur-[120px] opacity-50 mix-blend-screen" />
          <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-blue-500/10 rounded-full blur-[100px] opacity-40 mix-blend-screen" />
        </div>

        <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm"
          >
            <Star className="mr-2 h-4 w-4" />
            Premium Photography & Cinematography
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 max-w-4xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60"
          >
            Capture Your Best <br className="hidden md:block" />
            <span className="italic font-serif text-primary">Moments.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="max-w-[600px] text-muted-foreground md:text-xl mb-10"
          >
            Elevate your personal brand, cherish your wedding memories, or showcase your products with industry-leading visual storytelling.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link href="/book" className={buttonVariants({ size: "lg", className: "rounded-full text-base h-14 px-8 group" })}>
              Book a Session
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/portfolio" className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-full text-base h-14 px-8 border-border hover:bg-muted" })}>
              View Portfolio
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-24 bg-card relative z-10 border-t border-border">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We provide a wide range of premium services tailored to your specific needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Camera, title: "Wedding Photography", desc: "Cinematic and candid moments." },
              { icon: Users, title: "Portrait Sessions", desc: "Professional and personal branding." },
              { icon: Film, title: "Cinematography", desc: "High-end video production." },
              { icon: ImageIcon, title: "AI Gallery Delivery", desc: "Find your photos instantly." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-3xl bg-background border border-border/50 hover:border-primary/50 transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* AI Face Recognition Tech Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex-1"
            >
              <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6">Find Your Photos <span className="text-primary">Instantly.</span></h2>
              <p className="text-lg text-muted-foreground mb-8">
                No more scrolling through thousands of event photos. Upload a quick selfie, and our AI will instantly deliver a personalized gallery of every moment you were captured in.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "Secure, privacy-first facial mapping",
                  "Lightning-fast search across 10,000+ photos",
                  "Direct high-resolution downloads"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Star className="w-3 h-3 text-primary" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/search" className={buttonVariants({ size: "lg", className: "rounded-full" })}>Try Face Search</Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex-1 relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden bg-muted border border-border flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay" />
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full border-2 border-primary border-dashed flex items-center justify-center animate-spin-slow">
                  <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-heading font-bold text-lg">Scanning Event...</p>
                  <p className="text-sm text-primary">Found 42 matches</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
