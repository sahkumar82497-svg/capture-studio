"use client";

import { motion } from "framer-motion";
import { Users, Search, Mail, Phone, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminClients() {
  const clients = [
    { name: "Rahul Sharma", email: "rahul@example.com", phone: "+91 98765 43210", bookings: 2, joined: "Feb 2026", status: "Active" },
    { name: "Priya Das", email: "priya@example.com", phone: "+91 98765 43211", bookings: 1, joined: "Mar 2026", status: "Active" },
    { name: "Amit Patel", email: "amit@example.com", phone: "+91 98765 43212", bookings: 3, joined: "Jan 2026", status: "Active" },
    { name: "Sneha Gupta", email: "sneha@example.com", phone: "+91 98765 43213", bookings: 0, joined: "May 2026", status: "Lead" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" /> Clients
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your client database and leads.</p>
        </div>
        <Button className="rounded-xl">Add Client</Button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search clients by name, email or phone..." 
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto text-sm text-muted-foreground font-medium">
            Total Clients: {clients.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase border-b border-border bg-muted/10">
              <tr>
                <th className="px-6 py-4 font-medium">Client Info</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium text-center">Bookings</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={i} 
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0">
                        {client.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-base">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs hover:text-foreground transition-colors cursor-pointer">
                        <Mail className="w-3 h-3" /> {client.email}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-xs hover:text-foreground transition-colors cursor-pointer">
                        <Phone className="w-3 h-3" /> {client.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-medium">
                    {client.bookings > 0 ? (
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">{client.bookings}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{client.joined}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      client.status === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
