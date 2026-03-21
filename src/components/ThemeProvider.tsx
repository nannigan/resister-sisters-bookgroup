import { useEffect } from "react";
import { useThemeSettings } from "@/hooks/useThemeSettings";

// Map of font names to their Google Fonts URL slugs
const GOOGLE_FONT_MAP: Record<string, string> = {
  "Libre Baskerville": "Libre+Baskerville:ital,wght@0,400;0,700;1,400",
  "Source Sans 3": "Source+Sans+3:wght@300;400;500;600;700",
  "Lora": "Lora:wght@400;500;600;700",
  "Merriweather": "Merriweather:wght@300;400;700",
  "Playfair Display": "Playfair+Display:wght@400;500;600;700",
  "Roboto": "Roboto:wght@300;400;500;700",
  "Inter": "Inter:wght@400;500;600;700",
  "Open Sans": "Open+Sans:wght@300;400;600;700",
  "Montserrat": "Montserrat:wght@300;400;500;600;700",
  "Raleway": "Raleway:wght@300;400;500;600;700",
  "Poppins": "Poppins:wght@300;400;500;600;700",
  "Crimson Text": "Crimson+Text:wght@400;600;700",
  "PT Serif": "PT+Serif:wght@400;700",
  "Bitter": "Bitter:wght@400;500;600;700",
  "Nunito": "Nunito:wght@300;400;600;700",
};

function loadGoogleFont(fontName: string) {
  const slug = GOOGLE_FONT_MAP[fontName];
  if (!slug) return;
  const id = `gf-${fontName.replace(/\s+/g, "-").toLowerCase()}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${slug}&display=swap`;
  document.head.appendChild(link);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeSettings();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", theme.theme_primary);
    root.style.setProperty("--background", theme.theme_background);
    root.style.setProperty("--accent", theme.theme_accent);
    root.style.setProperty("--card", theme.theme_card);
    root.style.setProperty("--foreground", theme.theme_foreground);
    root.style.setProperty("--ring", theme.theme_primary);

    // Typography
    loadGoogleFont(theme.theme_font_display);
    loadGoogleFont(theme.theme_font_body);
    root.style.setProperty("--font-display", `'${theme.theme_font_display}', Georgia, serif`);
    root.style.setProperty("--font-body", `'${theme.theme_font_body}', system-ui, sans-serif`);
  }, [theme]);

  return <>{children}</>;
}
