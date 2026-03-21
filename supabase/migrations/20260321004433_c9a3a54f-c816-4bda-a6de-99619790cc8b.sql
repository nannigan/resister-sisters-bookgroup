
ALTER TABLE public.app_settings
  ADD COLUMN theme_primary text NOT NULL DEFAULT '161 93% 30%',
  ADD COLUMN theme_background text NOT NULL DEFAULT '205 62% 39%',
  ADD COLUMN theme_accent text NOT NULL DEFAULT '166 76% 96%',
  ADD COLUMN theme_card text NOT NULL DEFAULT '0 0% 98%',
  ADD COLUMN theme_foreground text NOT NULL DEFAULT '0 0% 9%';
