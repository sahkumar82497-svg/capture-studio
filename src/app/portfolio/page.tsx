"use client";

import { motion } from "framer-motion";

export default function PortfolioPage() {
  const categories = ["All", "Wedding", "Pre-Wedding", "Cinematography", "Events"];

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Header */}
      <section className="pt-32 pb-16 px-4 md:px-6">
        <div className="container mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl md:text-6xl font-bold mb-6"
          >
            Our <span className="text-primary italic font-serif">Masterpieces</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            A curated selection of our finest work across weddings, events, and cinematic productions.
          </motion.p>
        </div>
      </section>

      {/* Filter */}
      <section className="container mx-auto px-4 md:px-6 mb-12">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category, i) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${i === 0 ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:bg-foreground/10 hover:text-foreground'}`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Masonry Grid (Mocked for MVP) */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {[
            "aspect-square", "aspect-video", "aspect-[3/4]", "aspect-[4/3]", 
            "aspect-square", "aspect-[3/4]", "aspect-video", "aspect-square"
          ].map((aspectRatio, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className={`w-full ${aspectRatio} rounded-2xl bg-muted overflow-hidden relative group`}
            >
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-heading font-bold text-lg text-white">Event Name {i + 1}</h3>
                  <p className="text-sm text-white/70">Wedding Photography</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
