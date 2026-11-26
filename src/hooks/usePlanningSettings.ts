import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PlanningValues {
  next_meeting_date: string | null;
  next_book_picker_member_id: string | null;
}

export function usePlanningSettings() {
  const [settings, setSettings] = useState<(PlanningValues & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: loadError } = await supabase.from("app_settings")
        .select("id, next_meeting_date, next_book_picker_member_id").limit(1).single();
      if (loadError || !data) throw new Error("Could not load planning settings.");
      setSettings(data);
    } catch {
      setError("Could not load planning settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const save = async (values: PlanningValues) => {
    if (!settings) return false;
    setSaving(true);
    setError(null);
    try {
      const { data, error: saveError } = await supabase.from("app_settings")
        .update({
          next_meeting_date: values.next_meeting_date,
          next_book_picker_member_id: values.next_book_picker_member_id,
        }).eq("id", settings.id)
        .select("id, next_meeting_date, next_book_picker_member_id").single();
      if (saveError || !data) throw new Error("Could not save planning settings.");
      setSettings(data);
      return true;
    } catch {
      setError("Could not save planning settings. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { settings, loading, saving, error, load, save };
}