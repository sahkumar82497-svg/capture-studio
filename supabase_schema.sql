-- =============================================
-- CaptureFlow — Supabase Schema Setup
-- Run this in the Supabase SQL Editor
-- =============================================

-- Create Galleries Table
CREATE TABLE IF NOT EXISTS public.galleries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id TEXT,
    name TEXT,
    phone TEXT,
    venue TEXT,
    package_type TEXT NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    amount INTEGER NOT NULL DEFAULT 0,
    advance_paid INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Policies for galleries
CREATE POLICY "Enable read access for all users" ON public.galleries FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.galleries FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.galleries FOR UPDATE USING (true);

-- Policies for bookings
CREATE POLICY "Enable read access for all users" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.bookings FOR UPDATE USING (true);

-- Policies for contact_messages
CREATE POLICY "Enable insert for all" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read for all" ON public.contact_messages FOR SELECT USING (true);
