"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, LayoutDashboard, Image as ImageIcon, Calendar, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_LINKS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Galleries", href: "/admin/galleries", icon: ImageIcon },
  { name: "Bookings", href: "/admin/bookings", icon: Calendar },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col hidden md:flex shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border shrink-0">
          <Link href="/admin" className="flex items-center gap-2 group">
            <Camera className="w-5 h-5 text-primary" />
            <span className="font-heading font-bold text-lg tracking-tight">
              CaptureFlow
            </span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {ADMIN_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative",
                pathname === link.href 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <link.icon className="w-4 h-4" />
              {link.name}
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-border shrink-0">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar (Mobile mainly) */}
        <header className="h-16 border-b border-border bg-card flex items-center px-4 md:px-8 shrink-0 justify-between">
          <h2 className="font-heading font-semibold text-lg md:hidden">CaptureFlow</h2>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              S
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
