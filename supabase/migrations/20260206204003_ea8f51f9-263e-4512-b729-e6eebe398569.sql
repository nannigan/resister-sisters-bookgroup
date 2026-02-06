
-- Create book status enum
CREATE TYPE public.book_status AS ENUM ('candidate', 'current', 'finished');

-- Create member role enum
CREATE TYPE public.member_role AS ENUM ('admin', 'member');

-- Create books table
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  status public.book_status NOT NULL DEFAULT 'candidate',
  publication_date TEXT NOT NULL,
  page_count INTEGER NOT NULL,
  meeting_month TEXT,
  nominator TEXT,
  comment TEXT,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create members table
CREATE TABLE public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  role public.member_role NOT NULL DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create app_settings table (singleton)
CREATE TABLE public.app_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  access_token TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Since this app uses token-based access (no auth), allow all operations for anon role
-- The access control is handled at the application layer via the URL token

-- Books policies
CREATE POLICY "Allow all read on books" ON public.books FOR SELECT TO anon USING (true);
CREATE POLICY "Allow all insert on books" ON public.books FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow all update on books" ON public.books FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete on books" ON public.books FOR DELETE TO anon USING (true);

-- Members policies
CREATE POLICY "Allow all read on members" ON public.members FOR SELECT TO anon USING (true);
CREATE POLICY "Allow all insert on members" ON public.members FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow all update on members" ON public.members FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete on members" ON public.members FOR DELETE TO anon USING (true);

-- App settings policies
CREATE POLICY "Allow all read on app_settings" ON public.app_settings FOR SELECT TO anon USING (true);
CREATE POLICY "Allow all update on app_settings" ON public.app_settings FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON public.books
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial data
INSERT INTO public.app_settings (access_token) 
VALUES (encode(gen_random_bytes(24), 'hex'));

INSERT INTO public.members (name, email, role)
VALUES ('Admin', 'admin@bookgroup.com', 'admin');
