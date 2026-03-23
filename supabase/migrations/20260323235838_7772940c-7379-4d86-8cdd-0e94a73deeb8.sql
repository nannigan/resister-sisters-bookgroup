CREATE TABLE public.topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  submitted_by text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all read on topics" ON public.topics FOR SELECT TO anon USING (true);
CREATE POLICY "Allow all insert on topics" ON public.topics FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow all delete on topics" ON public.topics FOR DELETE TO anon USING (true);