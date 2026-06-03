"use client";

import { motion } from "framer-motion";
import { DollarSign, Server, HardDrive, Cpu, AlertTriangle } from "lucide-react";

export default function AdminCosts() {
  const services = [
    { name: "Backblaze B2 (Storage)", category: "Infrastructure", cost: "₹185.50", status: "Active", icon: HardDrive },
    { name: "Supabase DB (Compute)", category: "Database", cost: "Free Tier", status: "Active", icon: Server },
    { name: "Azure Face API", category: "AI Services", cost: "Free Tier", status: "Active", icon: Cpu },
    { name: "Cloudflare Pages", category: "Hosting", cost: "Free Tier", status: "Active", icon: Server }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-2">
            <DollarSign className="w-8 h-8 text-primary" /> Cost Monitor
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Track your infrastructure and API usage costs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 bg-card border border-border rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-lg"
        >
          <div className="p-4 bg-primary/10 rounded-full mb-4">
            <DollarSign className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-lg font-medium text-muted-foreground mb-1">Total MTD Cost</h2>
          <p className="text-5xl font-bold font-heading text-primary mb-2">₹185.50</p>
          <div className="flex items-center text-sm font-medium text-green-500 bg-green-500/10 px-3 py-1 rounded-full">
            Well below ₹500 budget
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-card border border-border rounded-2xl p-6"
        >
          <h3 className="font-heading font-semibold text-lg mb-6">Service Breakdown</h3>
          <div className="space-y-4">
            {services.map((service, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <service.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{service.name}</h4>
                    <p className="text-xs text-muted-foreground">{service.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${service.cost === 'Free Tier' ? 'text-green-500' : ''}`}>{service.cost}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 justify-end">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> {service.status}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-3 text-sm text-yellow-600 dark:text-yellow-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p>Azure Face API free tier allows 30,000 transactions per month. You have used approximately 4,200 this month.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
