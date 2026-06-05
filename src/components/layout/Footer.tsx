"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Mail, MapPin } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-card border-t border-border mt-auto pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight">
                The Capture Studio
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              Premium photography and cinematic videography based in Rourkela, Odisha. We capture your finest moments with elegance.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Camera className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Camera className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/portfolio" className="text-muted-foreground hover:text-primary text-sm transition-colors">Portfolio</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-primary text-sm transition-colors">Services & Pricing</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary text-sm transition-colors">Contact Us</Link></li>
              <li><Link href="/book" className="text-muted-foreground hover:text-primary text-sm transition-colors">Book a Session</Link></li>
            </ul>
          </div>

          {/* Client Area */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Client Area</h3>
            <ul className="space-y-3">
              <li><Link href="/client" className="text-muted-foreground hover:text-primary text-sm transition-colors">Client Login</Link></li>
              <li><Link href="/search" className="text-muted-foreground hover:text-primary text-sm transition-colors">Face Recognition Search</Link></li>
              <li><Link href="/faqs" className="text-muted-foreground hover:text-primary text-sm transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm">
                  Pratima Complex near Study Point<br />Udit Nagar, Rourkela (1st branch)<br /><br />
                  AL-28 Basanti Colony, Shop No. 9<br />Near Panitanki, Rourkela (2nd branch)
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:thecapturestudiorkl@gmail.com" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  thecapturestudiorkl@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone w-5 h-5 text-primary shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <a href="tel:+919348859053" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  +91 9348859053
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} The Capture Studio. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
