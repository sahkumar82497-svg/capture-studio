"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Users, Image as ImageIcon, Calendar, Loader2 } from "lucide-react";
import { getBookings } from "@/app/actions/bookings";
import { getGalleries } from "@/app/actions/galleries";

export default function AdminDashboard() {
  const [data, setData] = useState<{bookings: any[], galleries: any[]}>({ bookings: [], galleries: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [bks, gals] = await Promise.all([getBookings(), getGalleries()]);
      setData({ bookings: bks, galleries: gals });
      setLoading(false);
    }
    load();
  }, []);

  const totalRevenue = data.bookings.reduce((sum: number, b: any) => sum + (Number(b.amount) || 0), 0);
  const revenueStr = totalRevenue > 100000 ? `₹${(totalRevenue/100000).toFixed(1)}L` : `₹${totalRevenue.toLocaleString()}`;

  const stats = [
    { name: "Total Bookings", value: loading ? "-" : data.bookings.length.toString(), icon: Calendar, trend: "+new" },
    { name: "Active Galleries", value: loading ? "-" : data.galleries.length.toString(), icon: ImageIcon, trend: "live" },
    { name: "Total Clients", value: loading ? "-" : Array.from(new Set(data.bookings.map((b: any) => b.client_id))).length.toString(), icon: Users, trend: "active" },
    { name: "Revenue (All Time)", value: loading ? "-" : revenueStr, icon: DollarSign, trend: "total" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-heading">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-card border border-border flex flex-col gap-4"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 bg-primary/10 rounded-xl">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-1">{stat.name}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4 font-heading">Recent Bookings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Event Date</th>
                  <th className="px-4 py-3 font-medium">Package</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></td></tr>
                ) : data.bookings.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">No bookings found.</td></tr>
                ) : data.bookings.slice(0, 5).map((row: any) => (
                  <tr key={row.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium">{row.name || 'New Client'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(row.event_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 capitalize">{row.package_type?.replace('_', ' ')}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.status === 'confirmed' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cost Monitor Snippet */}
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col">
          <h2 className="text-lg font-bold mb-4 font-heading">Infrastructure Costs</h2>
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground mb-2">Estimated Monthly Cost (MTD)</p>
              <div className="text-4xl font-bold font-heading text-primary">₹185.50</div>
              <p className="text-xs text-green-500 mt-2">Well below ₹500 budget limit</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cloudflare Pages</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Supabase DB</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Azure Face API</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Backblaze B2 (Storage)</span>
                <span className="font-medium">₹185.50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
