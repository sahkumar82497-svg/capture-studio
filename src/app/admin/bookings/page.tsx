"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Search, Mail, Phone, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBookings, updateBooking } from "@/app/actions/bookings";

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  async function loadBookings() {
    setLoading(true);
    const data = await getBookings();
    setBookings(data);
    setLoading(false);
  }

  useEffect(() => {
    loadBookings();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    setSaving(true);
    await updateBooking(selectedBooking.id, {
      status: selectedBooking.status,
      advance_paid: selectedBooking.advance_paid
    });
    await loadBookings();
    setSelectedBooking(null);
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">Bookings & CRM</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage inquiries, confirmed bookings, and clients.</p>
        </div>
        <Button className="rounded-xl flex items-center gap-2">
          Add Manual Booking
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="font-heading font-semibold mb-4">Quick Filters</h3>
            <div className="space-y-2">
              {['All Bookings', 'Pending Advance', 'Confirmed', 'Completed', 'Cancelled'].map((f, i) => (
                <button key={f} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${i === 0 ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted text-muted-foreground'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : bookings.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-6 text-center text-muted-foreground">No bookings found.</div>
          ) : bookings.map((b: any, i) => (
            <motion.div 
              key={b.id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{b.name || 'New Client Booking'}</h3>
                  <div className="flex gap-4 mt-2">
                    <span className="flex items-center text-xs text-muted-foreground"><CalendarIcon className="w-3 h-3 mr-1" /> {new Date(b.event_date).toLocaleDateString()}</span>
                    <span className="flex items-center text-xs text-muted-foreground"><Phone className="w-3 h-3 mr-1" /> Contact</span>
                    <span className="flex items-center text-xs text-muted-foreground"><Mail className="w-3 h-3 mr-1" /> Email</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${b.status === 'confirmed' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                  {b.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-border mt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Package</p>
                  <p className="text-sm font-medium capitalize">{b.package_type?.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Amount</p>
                  <p className="text-sm font-medium">₹{b.amount}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Advance Paid</p>
                  <p className="text-sm font-medium text-green-500">₹{b.advance_paid}</p>
                </div>
                <div className="flex items-center justify-end">
                  <Button variant="outline" size="sm" className="rounded-lg" onClick={() => setSelectedBooking(b)}>Manage</Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-md overflow-hidden"
            >
              <div className="flex justify-between items-center p-4 border-b border-border">
                <h3 className="font-bold text-lg font-heading">Manage Booking</h3>
                <button onClick={() => setSelectedBooking(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select 
                    className="w-full bg-background border border-border rounded-xl px-4 py-3"
                    value={selectedBooking.status}
                    onChange={(e) => setSelectedBooking({...selectedBooking, status: e.target.value})}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Advance Paid (₹)</label>
                  <input 
                    type="number" 
                    className="w-full bg-background border border-border rounded-xl px-4 py-3"
                    value={selectedBooking.advance_paid}
                    onChange={(e) => setSelectedBooking({...selectedBooking, advance_paid: Number(e.target.value)})}
                  />
                </div>
                <div className="pt-4 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setSelectedBooking(null)}>Cancel</Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
