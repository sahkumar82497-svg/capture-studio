"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, UploadCloud, Folder, Settings2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getGalleries, createGallery } from "@/app/actions/galleries";
import Link from "next/link";

export default function AdminGalleries() {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", slug: "", date: "" });

  async function load() {
    setLoading(true);
    const data = await getGalleries();
    setGalleries(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    await createGallery({
      name: formData.name,
      slug: formData.slug,
      date: formData.date || new Date().toISOString(),
      status: "draft"
    });
    await load();
    setCreating(false);
    setShowModal(false);
    setFormData({ name: "", slug: "", date: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">Galleries</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage client galleries and photo uploads.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="rounded-xl flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Gallery
        </Button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search galleries..." 
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="rounded-lg h-9 w-full sm:w-auto">
              <Settings2 className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>
        </div>

        <div className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase border-b border-border bg-muted/10">
              <tr>
                <th className="px-6 py-4 font-medium">Gallery Name</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Photos</th>
                <th className="px-6 py-4 font-medium">Storage</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : galleries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No galleries found.
                  </td>
                </tr>
              ) : galleries.map((row, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={row.id || i} 
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Folder className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-semibold">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{row.client_id ? "Linked Client" : "Unassigned"}</td>
                  <td className="px-6 py-4">0</td>
                  <td className="px-6 py-4">0 B</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      row.status === 'published' ? 'bg-green-500/20 text-green-500' : 
                      row.status === 'processing' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {row.status || 'draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/galleries/${row.id}`}>
                      <Button variant="outline" size="sm" className="rounded-lg h-8">
                        <UploadCloud className="w-4 h-4 mr-2" /> Upload
                      </Button>
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-md overflow-hidden"
            >
              <div className="flex justify-between items-center p-4 border-b border-border">
                <h3 className="font-bold text-lg font-heading">Create New Gallery</h3>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gallery Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-background border border-border rounded-xl px-4 py-3"
                    placeholder="e.g. Rahul & Priya Wedding"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL Slug</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-background border border-border rounded-xl px-4 py-3"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Event Date</label>
                  <input 
                    required
                    type="date" 
                    className="w-full bg-background border border-border rounded-xl px-4 py-3"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="pt-4 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit" disabled={creating}>
                    {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Create Gallery
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
