"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, CheckCircle2, CreditCard, Camera, Info, Loader2, PartyPopper, UserPlus, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createBooking } from "@/app/actions/bookings";
import Link from "next/link";

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [selectedPackage, setSelectedPackage] = useState("wedding_premium");
  const [eventDate, setEventDate] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [venue, setVenue] = useState("");
  
  // Success state
  const [bookingComplete, setBookingComplete] = useState(false);

  const PACKAGES: Record<string, { name: string; price: string; amount: number }> = {
    prewedding: { name: "Pre-Wedding Shoot", price: "₹35,000", amount: 35000 },
    wedding_premium: { name: "Wedding Premium", price: "₹1,20,000", amount: 120000 },
    wedding_luxury: { name: "Wedding Luxury", price: "₹2,50,000", amount: 250000 },
  };
  
  const handlePackageChange = (id: string) => {
    setSelectedPackage(id);
  };

  const submitBooking = async () => {
    setIsSubmitting(true);
    const pkg = PACKAGES[selectedPackage];

    await createBooking({
      name: name.trim() || undefined,
      phone: phone.trim() || undefined,
      venue: venue.trim() || undefined,
      package_type: selectedPackage,
      event_date: eventDate || new Date().toISOString().split('T')[0],
      amount: pkg.amount,
      advance_paid: 0,
      status: 'pending'
    });
    
    setIsSubmitting(false);
    setBookingComplete(true);
  };

  if (bookingComplete) {
    const pkg = PACKAGES[selectedPackage];
    return (
      <div className="flex flex-col w-full pb-24 min-h-screen">
        <section className="pt-32 pb-8 px-4 md:px-6 flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-3xl p-8 md:p-12 max-w-lg w-full text-center shadow-xl"
          >
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <PartyPopper className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="font-heading text-3xl font-bold mb-3">Booking Submitted!</h1>
            <p className="text-muted-foreground mb-8">
              Thank you{name ? `, ${name}` : ''}! Our team will contact you within 24 hours to finalize the details.
            </p>
            
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-left mb-8 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Package</span>
                <span className="font-semibold">{pkg.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold">{pkg.price}</span>
              </div>
              {eventDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Event Date</span>
                  <span className="font-semibold">{new Date(eventDate).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="font-semibold text-yellow-500">Pending Confirmation</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/client" className="flex-1">
                <Button variant="outline" className="w-full rounded-xl">
                  <UserPlus className="w-4 h-4 mr-2" /> Sign In to Track
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button className="w-full rounded-xl">
                  <Home className="w-4 h-4 mr-2" /> Back to Home
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-24 min-h-screen">
      <section className="pt-32 pb-8 px-4 md:px-6 text-center">
        <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">Book Your Session</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">Reserve your date instantly. Our team will contact you shortly to finalize the booking.</p>
      </section>

      <section className="container mx-auto px-4 md:px-6 max-w-3xl flex-1">
        
        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-12 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted z-0 rounded-full" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary z-0 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
          
          {[
            { num: 1, label: "Package", icon: Camera },
            { num: 2, label: "Details", icon: Calendar },
            { num: 3, label: "Confirmation", icon: CheckCircle2 }
          ].map((s) => (
            <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                step >= s.num ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground border-4 border-background'
              }`}>
                {step > s.num ? <CheckCircle2 className="w-6 h-6" /> : <s.icon className="w-5 h-5" />}
              </div>
              <span className={`text-xs font-medium ${step >= s.num ? 'text-primary' : 'text-muted-foreground'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-card border border-border rounded-3xl p-6 md:p-10 shadow-lg">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="font-heading text-2xl font-bold">Select Package</h2>
                
                <div className="space-y-4">
                  {Object.entries(PACKAGES).map(([id, pkg]) => (
                    <label key={id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary cursor-pointer transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                      <div className="flex items-center gap-4">
                        <input 
                          type="radio" 
                          name="package" 
                          className="w-5 h-5 accent-primary" 
                          checked={selectedPackage === id}
                          onChange={() => handlePackageChange(id)}
                        />
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            {pkg.name}
                            {id === 'wedding_premium' && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase">Popular</span>}
                          </div>
                        </div>
                      </div>
                      <span className="font-bold">{pkg.price}</span>
                    </label>
                  ))}
                </div>

                <div className="pt-6 flex justify-end">
                  <Button onClick={() => setStep(2)} size="lg" className="rounded-full px-8">Continue to Details</Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="font-heading text-2xl font-bold">Event Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Name *</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-background border border-border rounded-xl px-4 py-3" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3" placeholder="+91 98765 43210" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Event Date *</label>
                    <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} required className="w-full bg-background border border-border rounded-xl px-4 py-3" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Venue Location</label>
                    <input type="text" value={venue} onChange={e => setVenue(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3" placeholder="Taj Lake Palace, Udaipur" />
                  </div>
                </div>

                <div className="pt-6 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)} className="rounded-full px-8">Back</Button>
                  <Button onClick={() => setStep(3)} size="lg" className="rounded-full px-8" disabled={!name.trim()}>Proceed to Confirmation</Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="font-heading text-2xl font-bold">Confirm Booking</h2>
                
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="font-medium">Package</span>
                    <span className="font-bold">{PACKAGES[selectedPackage].name}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="font-medium">Price</span>
                    <span className="font-bold">{PACKAGES[selectedPackage].price}</span>
                  </div>
                  {name && (
                    <div className="flex justify-between items-center pb-3 border-b border-border">
                      <span className="font-medium">Name</span>
                      <span className="font-bold">{name}</span>
                    </div>
                  )}
                  {eventDate && (
                    <div className="flex justify-between items-center pb-3 border-b border-border">
                      <span className="font-medium">Event Date</span>
                      <span className="font-bold">{new Date(eventDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {venue && (
                    <div className="flex justify-between items-center pb-3 border-b border-border">
                      <span className="font-medium">Venue</span>
                      <span className="font-bold">{venue}</span>
                    </div>
                  )}
                  <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>By submitting this request, our team will reserve these dates and contact you with the final invoice and itinerary within 24 hours.</p>
                  </div>
                </div>

                <div className="pt-6 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)} className="rounded-full px-8" disabled={isSubmitting}>Back</Button>
                  <Button size="lg" onClick={submitBooking} disabled={isSubmitting} className="rounded-full px-8 bg-primary hover:bg-primary/90">
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Booking Request"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </section>
    </div>
  );
}
