
CREATE POLICY "Allow all read on app_settings"
ON public.app_settings
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow all update on app_settings"
ON public.app_settings
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);
