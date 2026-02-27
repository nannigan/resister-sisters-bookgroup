
-- Add length and format constraints on members table
ALTER TABLE public.members
  ADD CONSTRAINT members_name_length CHECK (length(name) <= 100 AND length(name) > 0),
  ADD CONSTRAINT members_email_length CHECK (email IS NULL OR length(email) <= 255),
  ADD CONSTRAINT members_phone_length CHECK (phone IS NULL OR length(phone) <= 30),
  ADD CONSTRAINT members_email_format CHECK (
    email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );
