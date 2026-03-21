import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface ThemeColors {
  theme_primary: string;
  theme_background: string;
  theme_accent: string;
  theme_card: string;
  theme_foreground: string;
}

const DEFAULT_THEME: ThemeColors = {
  theme_primary: "161 93% 30%",
  theme_background: "205 62% 39%",
  theme_accent: "166 76% 96%",
  theme_card: "0 0% 98%",
  theme_foreground: "0 0% 9%",
};

export function useThemeSettings() {
  const queryClient = useQueryClient();

  const { data: theme, isLoading } = useQuery({
    queryKey: ["theme-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("app_settings")
        .select("theme_primary, theme_background, theme_accent, theme_card, theme_foreground")
        .limit(1)
        .single();
      if (error || !data) return DEFAULT_THEME;
      return data as ThemeColors;
    },
    staleTime: 1000 * 60 * 5,
  });

  const updateTheme = useMutation({
    mutationFn: async (colors: ThemeColors) => {
      const { data: settings } = await supabase
        .from("app_settings")
        .select("id")
        .limit(1)
        .single();
      if (!settings) throw new Error("No settings row found");
      const { error } = await supabase
        .from("app_settings")
        .update(colors)
        .eq("id", settings.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["theme-settings"] });
    },
  });

  return { theme: theme ?? DEFAULT_THEME, isLoading, updateTheme };
}
