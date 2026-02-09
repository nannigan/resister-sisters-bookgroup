import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAppSettings() {
  const [loading, setLoading] = useState(false);

  const regenerateToken = async (currentToken: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('regenerate-token', {
        body: { current_token: currentToken },
      });

      if (error || !data?.new_token) {
        setLoading(false);
        return { error: error || new Error('Failed to regenerate token'), newToken: null };
      }

      setLoading(false);
      return { error: null, newToken: data.new_token as string };
    } catch (err) {
      setLoading(false);
      return { error: err as Error, newToken: null };
    }
  };

  return { loading, regenerateToken };
}
