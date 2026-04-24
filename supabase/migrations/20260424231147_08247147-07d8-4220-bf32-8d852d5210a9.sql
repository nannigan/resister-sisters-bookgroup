ALTER TABLE public.books
  ADD COLUMN format text,
  ADD COLUMN library_available boolean NOT NULL DEFAULT false;