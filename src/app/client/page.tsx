"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Calendar, LogOut, Download, Image as ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { getGalleries } from "@/app/actions/galleries";
import { getBookings } from "@/app/actions/bookings";

export default function ClientDashboard() {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCopySearch = () => {
    navigator.clipboard.writeText(window.location.origin + "/search");
    alert("Search link copied to clipboard!");
  };

  const handleDownload = (name: string) => {
    alert(`Downloading gallery: ${name}`);
  };

  useEffect(() => {
    async function load() {
      const [gals, bks] = await Promise.all([getGalleries(), getBookings()]);
      setGalleries(gals);
      setBookings(bks);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen bg-muted/20">
      {/* Dashboard Header */}
      <header className="bg-card border-b border-border py-8 px-4 md:px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold">Your Dashboard</h1>
            <p className="text-muted-foreground">Manage your bookings and galleries here.</p>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="rounded-full">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content - Galleries */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold flex items-center gap-2">
                <ImageIcon className="text-primary" /> Your Galleries
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                <div className="col-span-full flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              ) : galleries.length === 0 ? (
                <div className="col-span-full bg-card border border-border rounded-3xl p-6 text-center text-muted-foreground">No galleries yet.</div>
              ) : galleries.map((gallery, i) => (
                <motion.div 
                  key={gallery.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-3xl overflow-hidden group hover:border-primary transition-colors cursor-pointer"
                >
                  <div className="h-48 bg-muted relative">
                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors" />
                    <div className="absolute top-4 right-4 bg-background/80 backdrop-blur text-xs font-semibold px-3 py-1 rounded-full">
                      {gallery.status || 'Draft'}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-1">{gallery.name}</h3>
                    <div className="flex justify-between text-sm text-muted-foreground mb-6">
                      <span>{new Date(gallery.date).toLocaleDateString()}</span>
                      <span>0 photos</span>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/g/${gallery.slug || gallery.id}`} className={buttonVariants({ className: "w-full rounded-xl" })}>
                        View Gallery
                      </Link>
                      <Button variant="outline" size="icon" className="rounded-xl shrink-0" onClick={() => handleDownload(gallery.name)}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Smart Face Search Teaser */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 bg-gradient-to-r from-primary/20 to-transparent border border-primary/20 rounded-3xl p-8 flex items-center justify-between"
            >
              <div>
                <h3 className="font-heading text-xl font-bold mb-2">Want to find photos of a specific guest?</h3>
                <p className="text-muted-foreground mb-4">Share the smart face search link with your guests.</p>
                <Button className="rounded-full" onClick={handleCopySearch}>Copy Search Link</Button>
              </div>
              <div className="hidden md:flex w-24 h-24 bg-card rounded-full items-center justify-center border-4 border-background shadow-xl shrink-0">
                <Camera className="w-10 h-10 text-primary" />
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Bookings */}
          <div className="space-y-8">
            <h2 className="font-heading text-2xl font-bold flex items-center gap-2">
              <Calendar className="text-primary" /> Bookings
            </h2>
            
            {loading ? (
              <div className="bg-card border border-border rounded-3xl p-6 flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : bookings.length === 0 ? (
              <div className="bg-card border border-border rounded-3xl p-6 text-center text-muted-foreground">No recent bookings.</div>
            ) : bookings.map(booking => (
              <div key={booking.id} className="bg-card border border-border rounded-3xl p-6 space-y-4 mb-4">
                <div className="pb-4 border-b border-border">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold capitalize">{booking.package_type?.replace('_', ' ')}</h4>
                    <span className="text-xs bg-green-500/20 text-green-500 font-semibold px-2 py-1 rounded-full">{booking.status}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{new Date(booking.event_date).toLocaleDateString()}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-semibold">₹{booking.amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Advance Paid</span>
                  <span className="font-semibold text-green-500">₹{booking.advance_paid}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-border">
                  <span>Balance Due</span>
                  <span className="text-destructive">₹{booking.amount - booking.advance_paid}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
