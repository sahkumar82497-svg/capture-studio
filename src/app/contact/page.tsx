"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitContactMessage } from "@/app/actions/contact";
import { toast } from "sonner";

export default function ContactPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    const result = await submitContactMessage({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      message: message.trim(),
    });
    setLoading(false);

    if (result.success) {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setSent(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      setMessage("");
    } else {
      toast.error(result.error || "Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col w-full pb-24">
      <section className="pt-32 pb-16 px-4 md:px-6">
        <div className="container mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl md:text-6xl font-bold mb-6"
          >
            Get in <span className="text-primary italic font-serif">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            We would love to hear from you. Drop us a message and we&apos;ll get back to you as soon as possible.
          </motion.p>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <h2 className="font-heading text-2xl font-bold">Contact Information</h2>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Our Studio</h3>
                <p className="text-muted-foreground text-sm">
                  Pratima Complex near Study Point<br />
                  Udit Nagar, Rourkela (1st branch)<br />
                  <br />
                  AL-28 Basanti Colony, Shop No. 9<br />
                  Near Panitanki, Rourkela (2nd branch)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email Us</h3>
                <a href="mailto:thecapturestudiorkl@gmail.com" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  thecapturestudiorkl@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Call Us</h3>
                <a href="tel:+919348859053" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  +91 9348859053
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-3xl p-8"
          >
            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="font-heading text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground mb-6">Thank you for reaching out. We&apos;ll respond within 24 hours.</p>
                <Button onClick={() => setSent(false)} variant="outline" className="rounded-xl">Send Another Message</Button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name *</label>
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors" placeholder="Doe" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address *</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors" placeholder="john@example.com" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message *</label>
                  <textarea rows={4} value={message} onChange={e => setMessage(e.target.value)} required className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors resize-none" placeholder="Tell us about your event..." />
                </div>

                <Button type="submit" className="w-full rounded-lg" size="lg" disabled={loading}>
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : "Send Message"}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
