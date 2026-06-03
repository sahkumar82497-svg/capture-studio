"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, CheckCircle2, CreditCard, Camera, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createBooking } from "@/app/actions/bookings";
import { useRouter } from "next/navigation";

export default function BookPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [selectedPackage, setSelectedPackage] = useState("wedding_premium");
  const [eventDate, setEventDate] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  
  const handlePackageChange = (id: string) => {
    setSelectedPackage(id);
  };

  const submitBooking = async () => {
    setIsSubmitting(true);
    let amount = 120000;
    if (selectedPackage === 'prewedding') amount = 35000;
    if (selectedPackage === 'wedding_luxury') amount = 250000;

    await createBooking({
      package_type: selectedPackage,
      event_date: eventDate || new Date().toISOString().split('T')[0],
      amount: amount,
      advance_paid: 0,
      status: 'pending'
    });
    
    setIsSubmitting(false);
    // Success, go to client dashboard
    router.push('/client');
  };

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
                  {[
                    { id: 'prewedding', name: "Pre-Wedding Shoot", price: "₹35,000" },
                    { id: 'wedding_premium', name: "Wedding Premium", price: "₹1,20,000", popular: true },
                    { id: 'wedding_luxury', name: "Wedding Luxury", price: "₹2,50,000" },
                  ].map(pkg => (
                    <label key={pkg.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary cursor-pointer transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                      <div className="flex items-center gap-4">
                        <input 
                          type="radio" 
                          name="package" 
                          className="w-5 h-5 accent-primary" 
                          checked={selectedPackage === pkg.id}
                          onChange={() => handlePackageChange(pkg.id)}
                        />
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            {pkg.name}
                            {pkg.popular && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase">Popular</span>}
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
                    <label className="text-sm font-medium">Your Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3" placeholder="+91 98765 43210" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Event Dates</label>
                    <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Venue Location</label>
                    <input type="text" className="w-full bg-background border border-border rounded-xl px-4 py-3" placeholder="Taj Lake Palace, Udaipur" />
                  </div>
                </div>

                <div className="pt-6 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)} className="rounded-full px-8">Back</Button>
                  <Button onClick={() => setStep(3)} size="lg" className="rounded-full px-8">Proceed to Confirmation</Button>
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
                
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
                    <span className="font-medium">Selected Package</span>
                    <span className="font-bold capitalize">{selectedPackage.replace('_', ' ')}</span>
                  </div>
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
