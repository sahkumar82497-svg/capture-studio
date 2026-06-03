-- CaptureFlow Supabase Schema

-- Enable pgvector extension
create extension if not exists vector;

-- 1. Profiles Table (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role text check (role in ('admin', 'client')) default 'client',
  full_name text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Galleries Table
create table galleries (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references profiles(id) on delete set null,
  name text not null,
  slug text unique not null,
  date date not null,
  cover_image_url text,
  status text check (status in ('draft', 'published', 'archived')) default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Photos Table
create table photos (
  id uuid default gen_random_uuid() primary key,
  gallery_id uuid references galleries(id) on delete cascade not null,
  storage_key text not null,
  blurhash text,
  width integer,
  height integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Faces Table (for Face Recognition)
create table faces (
  id uuid default gen_random_uuid() primary key,
  photo_id uuid references photos(id) on delete cascade not null,
  embedding vector(128) not null, -- For Azure/CompreFace embeddings
  bounding_box jsonb, -- {x, y, w, h}
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Bookings Table
create table bookings (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references profiles(id) on delete set null,
  package_type text not null,
  event_date date not null,
  status text check (status in ('pending', 'confirmed', 'completed', 'cancelled')) default 'pending',
  amount numeric(10,2) not null,
  advance_paid numeric(10,2) default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for fast vector similarity search
create index on faces using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- Setup RLS (Row Level Security)
alter table profiles enable row level security;
alter table galleries enable row level security;
alter table photos enable row level security;
alter table faces enable row level security;
alter table bookings enable row level security;

-- Policies for public access to published galleries
create policy "Public can view published galleries" on galleries for select using (status = 'published');
create policy "Public can view photos of published galleries" on photos for select using (
  gallery_id in (select id from galleries where status = 'published')
);

-- Policies for Clients (can see their own galleries and bookings)
create policy "Clients can view their own galleries" on galleries for select using (client_id = auth.uid());
create policy "Clients can view their own bookings" on bookings for select using (client_id = auth.uid());
create policy "Clients can view their own profile" on profiles for select using (id = auth.uid());
create policy "Clients can update their own profile" on profiles for update using (id = auth.uid());

-- Policies for Admins (can do everything)
-- We check if the user's role in the profiles table is 'admin'
create policy "Admins can do everything on profiles" on profiles for all using (
  (select role from profiles where id = auth.uid()) = 'admin'
);
create policy "Admins can do everything on galleries" on galleries for all using (
  (select role from profiles where id = auth.uid()) = 'admin'
);
create policy "Admins can do everything on photos" on photos for all using (
  (select role from profiles where id = auth.uid()) = 'admin'
);
create policy "Admins can do everything on faces" on faces for all using (
  (select role from profiles where id = auth.uid()) = 'admin'
);
create policy "Admins can do everything on bookings" on bookings for all using (
  (select role from profiles where id = auth.uid()) = 'admin'
);
