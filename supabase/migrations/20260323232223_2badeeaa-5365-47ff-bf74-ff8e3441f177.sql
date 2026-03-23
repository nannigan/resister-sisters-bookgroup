CREATE TYPE public.book_category AS ENUM ('political', 'fun');
ALTER TABLE public.books ADD COLUMN category public.book_category NOT NULL DEFAULT 'political';