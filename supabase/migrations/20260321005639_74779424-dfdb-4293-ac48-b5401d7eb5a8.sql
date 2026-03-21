
ALTER TABLE public.app_settings
  ADD COLUMN theme_font_display text NOT NULL DEFAULT 'Libre Baskerville',
  ADD COLUMN theme_font_body text NOT NULL DEFAULT 'Source Sans 3';
