ALTER TABLE public.app_settings
  ADD COLUMN next_meeting_date date,
  ADD COLUMN next_book_picker_member_id uuid REFERENCES public.members(id) ON DELETE SET NULL;