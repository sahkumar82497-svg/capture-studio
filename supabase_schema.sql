-- Create Galleries Table
CREATE TABLE public.galleries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create Bookings Table
CREATE TABLE public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id TEXT,
    name TEXT,
    package_type TEXT NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    amount INTEGER NOT NULL,
    advance_paid INTEGER NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow public read access (Modify these later for security!)
CREATE POLICY "Enable read access for all users" ON public.galleries FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.galleries FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.galleries FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.bookings FOR UPDATE USING (true);
