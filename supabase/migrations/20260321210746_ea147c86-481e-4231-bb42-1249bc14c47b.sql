
CREATE TABLE public.votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  book_id uuid NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  rank integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (member_id, book_id)
);

ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all read on votes" ON public.votes FOR SELECT TO anon USING (true);
CREATE POLICY "Allow all insert on votes" ON public.votes FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow all update on votes" ON public.votes FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete on votes" ON public.votes FOR DELETE TO anon USING (true);
