"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function ServicesPage() {
  const packages = [
    {
      name: "Pre-Wedding",
      price: "₹35,000",
      description: "A magical day dedicated to capturing your chemistry.",
      features: [
        "1 Day Shoot",
        "Cinematic Highlights (3-5 mins)",
        "30 Edited High-Res Photos",
        "Drone Coverage (subject to permissions)",
        "Private Online Gallery"
      ]
    },
    {
      name: "Wedding Premium",
      price: "₹1,20,000",
      isPopular: true,
      description: "Comprehensive coverage of your special day.",
      features: [
        "2 Days Coverage",
        "Traditional & Candid Photography",
        "Cinematic Wedding Film (15-20 mins)",
        "Premium Photobook (40 sheets)",
        "AI Face Search Gallery for Guests",
        "Drone & Gimbal Setup"
      ]
    },
    {
      name: "Wedding Luxury",
      price: "₹2,50,000",
      description: "The ultimate cinematic and photography experience.",
      features: [
        "3+ Days Full Coverage",
        "Multiple Cinematographers & Photographers",
        "Same Day Edit Screenings",
        "2 Premium Photobooks (40 sheets each)",
        "Priority Editing (15 days delivery)",
        "Lifetime Cloud Backup"
      ]
    }
  ];

  return (
    <div className="flex flex-col w-full pb-24">
      <section className="pt-32 pb-16 px-4 md:px-6">
        <div className="container mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl md:text-6xl font-bold mb-6"
          >
            Services & <span className="text-primary italic font-serif">Pricing</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Transparent pricing for premium quality. Choose the package that best fits your story.
          </motion.p>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-3xl p-8 border flex flex-col bg-card ${pkg.isPopular ? 'border-primary shadow-[0_0_40px_rgba(var(--primary),0.1)]' : 'border-border'}`}
            >
              {pkg.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <h3 className="font-heading text-2xl font-bold mb-2">{pkg.name}</h3>
              <p className="text-muted-foreground mb-6 h-12">{pkg.description}</p>
              
              <div className="mb-8">
                <span className="text-4xl font-bold">{pkg.price}</span>
                {pkg.name.includes("Wedding") && <span className="text-muted-foreground text-sm"> / onwards</span>}
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/book" className={buttonVariants({ variant: pkg.isPopular ? "default" : "outline", className: "w-full rounded-full" })}>
                Book This Package
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 mt-32 text-center">
        <h2 className="font-heading text-3xl font-bold mb-6">Need a custom package?</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          We understand every event is unique. Let&apos;s discuss your requirements and create a personalized quote.
        </p>
        <Link href="/contact" className={buttonVariants({ size: "lg", variant: "secondary", className: "rounded-full group" })}>
          Contact Us <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>
    </div>
  );
}
