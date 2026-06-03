import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Capture Studio | Premium Photography & Face Recognition",
  description: "Experience premium photography with AI-powered face recognition gallery delivery.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CaptureFlow",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground overflow-x-hidden relative">
        {/* Global Branding Background */}
        <div className="fixed inset-0 z-[-1] bg-[url('/branding_bg1.jpg')] bg-cover bg-center opacity-10 mix-blend-screen blur-[2px]" />
        
        <Navbar />
        <main className="flex-1 pt-[72px] relative z-10">
          {children}
        </main>
        <Footer />
        <Toaster theme="dark" position="top-right" />
      </body>
    </html>
  );
}
