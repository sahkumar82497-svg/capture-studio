"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Search, Mail, Phone, Loader2, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBookings, createBooking, updateBooking } from "@/app/actions/bookings";
import { toast } from "sonner";

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState("all");

  // New booking form state
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPackage, setNewPackage] = useState("wedding_premium");
  const [newDate, setNewDate] = useState("");
  const [newAmount, setNewAmount] = useState(120000);
  const [newAdvance, setNewAdvance] = useState(0);

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
    const result = await updateBooking(selectedBooking.id, {
      status: selectedBooking.status,
      advance_paid: selectedBooking.advance_paid
    });
    if (result.success) {
      toast.success("Booking updated successfully!");
    } else {
      toast.error(result.error || "Failed to update booking.");
    }
    await loadBookings();
    setSelectedBooking(null);
    setSaving(false);
  };

  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDate) {
      toast.error("Please fill in name and event date.");
      return;
    }
    setSaving(true);
    const result = await createBooking({
      name: newName.trim(),
      phone: newPhone.trim() || undefined,
      package_type: newPackage,
      event_date: newDate,
      amount: newAmount,
      advance_paid: newAdvance,
      status: "pending",
    });
    if (result.success) {
      toast.success("Booking created successfully!");
      setShowAddModal(false);
      setNewName("");
      setNewPhone("");
      setNewPackage("wedding_premium");
      setNewDate("");
      setNewAmount(120000);
      setNewAdvance(0);
    } else {
      toast.error(result.error || "Failed to create booking.");
    }
    await loadBookings();
    setSaving(false);
  };

  const filteredBookings = filter === "all" 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">Bookings & CRM</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage inquiries, confirmed bookings, and clients.</p>
        </div>
        <Button className="rounded-xl flex items-center gap-2" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" /> Add Manual Booking
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="font-heading font-semibold mb-4">Quick Filters</h3>
            <div className="space-y-2">
              {[
                { key: 'all', label: 'All Bookings' },
                { key: 'pending', label: 'Pending' },
                { key: 'confirmed', label: 'Confirmed' },
                { key: 'completed', label: 'Completed' },
                { key: 'cancelled', label: 'Cancelled' },
              ].map((f) => (
                <button 
                  key={f.key} 
                  onClick={() => setFilter(f.key)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    filter === f.key ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {f.label}
                  <span className="float-right text-xs opacity-70">
                    {f.key === 'all' ? bookings.length : bookings.filter(b => b.status === f.key).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-6 text-center text-muted-foreground">No bookings found.</div>
          ) : filteredBookings.map((b: any, i) => (
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
                    {b.phone && <span className="flex items-center text-xs text-muted-foreground"><Phone className="w-3 h-3 mr-1" /> {b.phone}</span>}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${b.status === 'confirmed' ? 'bg-green-500/20 text-green-500' : b.status === 'completed' ? 'bg-blue-500/20 text-blue-500' : b.status === 'cancelled' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
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

      {/* Manage Booking Modal */}
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

      {/* Add Manual Booking Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-md overflow-hidden"
            >
              <div className="flex justify-between items-center p-4 border-b border-border">
                <h3 className="font-bold text-lg font-heading">Add Manual Booking</h3>
                <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddBooking} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Client Name *</label>
                  <input 
                    type="text" 
                    className="w-full bg-background border border-border rounded-xl px-4 py-3"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <input 
                    type="tel" 
                    className="w-full bg-background border border-border rounded-xl px-4 py-3"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 9348859053"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Package *</label>
                  <select 
                    className="w-full bg-background border border-border rounded-xl px-4 py-3"
                    value={newPackage}
                    onChange={(e) => {
                      setNewPackage(e.target.value);
                      if (e.target.value === 'prewedding') setNewAmount(35000);
                      else if (e.target.value === 'wedding_luxury') setNewAmount(250000);
                      else setNewAmount(120000);
                    }}
                  >
                    <option value="prewedding">Pre-Wedding Shoot — ₹35,000</option>
                    <option value="wedding_premium">Wedding Premium — ₹1,20,000</option>
                    <option value="wedding_luxury">Wedding Luxury — ₹2,50,000</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Event Date *</label>
                  <input 
                    type="date" 
                    className="w-full bg-background border border-border rounded-xl px-4 py-3"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Amount (₹)</label>
                    <input 
                      type="number" 
                      className="w-full bg-background border border-border rounded-xl px-4 py-3"
                      value={newAmount}
                      onChange={(e) => setNewAmount(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Advance (₹)</label>
                    <input 
                      type="number" 
                      className="w-full bg-background border border-border rounded-xl px-4 py-3"
                      value={newAdvance}
                      onChange={(e) => setNewAdvance(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />} Create Booking
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
