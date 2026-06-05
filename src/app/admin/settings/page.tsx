"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Save, Bell, Shield, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('General');

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-2">
            <Settings className="w-8 h-8 text-primary" /> Settings
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Configure your studio preferences and system settings.</p>
        </div>
        <Button className="rounded-xl flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
        <div className="md:col-span-1 space-y-2">
          {['General', 'Notifications', 'Security', 'Appearance'].map((tab, i) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
            >
              <div className="flex items-center gap-2">
                {tab === 'General' && <Settings className="w-4 h-4" />}
                {tab === 'Notifications' && <Bell className="w-4 h-4" />}
                {tab === 'Security' && <Shield className="w-4 h-4" />}
                {tab === 'Appearance' && <Palette className="w-4 h-4" />}
                {tab}
              </div>
            </button>
          ))}
        </div>

        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-3 space-y-6"
        >
          {activeTab === 'General' && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-heading text-xl font-bold mb-6">General Information</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Studio Name</label>
                  <input type="text" defaultValue="The Capture Studio" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Email</label>
                  <input type="email" defaultValue="thecapturestudiorkl@gmail.com" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <input type="tel" defaultValue="+91 9348859053" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Studio Address</label>
                  <textarea rows={3} defaultValue="Pratima Complex near Study Point, Udit Nagar, Rourkela (1st branch)&#13;&#10;AL-28 Basanti Colony, Shop No. 9 Near Panitanki, Rourkela (2nd branch)" className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary resize-none" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-heading text-xl font-bold mb-6">Notifications</h2>
              <p className="text-muted-foreground text-sm">Notification settings will be implemented here.</p>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-heading text-xl font-bold mb-6">Security</h2>
              <p className="text-muted-foreground text-sm">Security and password settings will be implemented here.</p>
            </div>
          )}

          {activeTab === 'Appearance' && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-heading text-xl font-bold mb-6">Appearance</h2>
              <p className="text-muted-foreground text-sm">Theme and branding settings will be implemented here.</p>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
