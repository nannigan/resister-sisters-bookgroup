import { useEffect } from "react";
import { useThemeSettings } from "@/hooks/useThemeSettings";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeSettings();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", theme.theme_primary);
    root.style.setProperty("--background", theme.theme_background);
    root.style.setProperty("--accent", theme.theme_accent);
    root.style.setProperty("--card", theme.theme_card);
    root.style.setProperty("--foreground", theme.theme_foreground);
    // Keep ring in sync with primary
    root.style.setProperty("--ring", theme.theme_primary);
  }, [theme]);

  return <>{children}</>;
}
