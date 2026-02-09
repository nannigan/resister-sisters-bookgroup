-- Remove public access to app_settings to protect the access token
-- Edge functions will use the service role key to access this table instead

DROP POLICY "Allow all read on app_settings" ON public.app_settings;
DROP POLICY "Allow all update on app_settings" ON public.app_settings;