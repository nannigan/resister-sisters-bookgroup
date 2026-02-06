import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAppSettings() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("app_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      setAccessToken(data.access_token);
      setSettingsId(data.id);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const regenerateToken = async () => {
    if (!settingsId) return { error: new Error("No settings found"), newToken: null };

    // Generate a new random token
    const array = new Uint8Array(24);
    crypto.getRandomValues(array);
    const newToken = Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");

    const { error } = await supabase
      .from("app_settings")
      .update({ access_token: newToken })
      .eq("id", settingsId);

    if (!error) {
      setAccessToken(newToken);
      return { error: null, newToken };
    }
    return { error, newToken: null };
  };

  return { accessToken, loading, regenerateToken, refetch: fetchSettings };
}
