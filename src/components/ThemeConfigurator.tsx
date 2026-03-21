import { useState, useEffect } from "react";
import { useThemeSettings, ThemeColors } from "@/hooks/useThemeSettings";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Type, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const COLOR_FIELDS: { key: keyof ThemeColors; label: string; description: string }[] = [
  { key: "theme_primary", label: "Primary", description: "Buttons, active nav, links" },
  { key: "theme_background", label: "Background", description: "Page background" },
  { key: "theme_accent", label: "Accent", description: "Highlights, badges" },
  { key: "theme_card", label: "Card", description: "Card & panel backgrounds" },
  { key: "theme_foreground", label: "Foreground", description: "Main text color" },
];

const DISPLAY_FONTS = [
  "Libre Baskerville", "Lora", "Merriweather", "Playfair Display",
  "Crimson Text", "PT Serif", "Bitter",
];

const BODY_FONTS = [
  "Source Sans 3", "Inter", "Roboto", "Open Sans",
  "Montserrat", "Raleway", "Poppins", "Nunito",
];

const DEFAULTS: ThemeColors = {
  theme_primary: "161 93% 30%",
  theme_background: "205 62% 39%",
  theme_accent: "166 76% 96%",
  theme_card: "0 0% 98%",
  theme_foreground: "0 0% 9%",
  theme_font_display: "Libre Baskerville",
  theme_font_body: "Source Sans 3",
};

function hslStringToHex(hsl: string): string {
  const parts = hsl.trim().split(/\s+/);
  if (parts.length < 3) return "#000000";
  const h = parseFloat(parts[0]);
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHslString(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export default function ThemeConfigurator() {
  const { theme, updateTheme } = useThemeSettings();
  const [draft, setDraft] = useState<ThemeColors>(theme);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(theme);
  }, [theme]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateTheme.mutateAsync(draft);
      toast.success("Theme saved!");
    } catch {
      toast.error("Failed to save theme.");
    }
    setSaving(false);
  };

  const handleReset = () => setDraft(DEFAULTS);

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-6">
      {/* Colors Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          <h3 className="font-display font-semibold text-foreground">Colors</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {COLOR_FIELDS.map(({ key, label, description }) => (
            <div key={key} className="space-y-1.5">
              <Label className="font-body font-semibold text-sm">{label}</Label>
              <p className="text-xs text-muted-foreground font-body">{description}</p>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={hslStringToHex(draft[key])}
                  onChange={(e) => setDraft({ ...draft, [key]: hexToHslString(e.target.value) })}
                  className="h-9 w-12 rounded border border-border cursor-pointer"
                />
                <Input
                  value={draft[key]}
                  onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                  className="font-mono text-xs"
                  placeholder="H S% L%"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Preview strip */}
        <div className="flex gap-2 pt-1">
          {COLOR_FIELDS.map(({ key, label }) => (
            <div key={key} className="text-center">
              <div
                className="w-10 h-10 rounded-md border border-border"
                style={{ backgroundColor: `hsl(${draft[key]})` }}
              />
              <span className="text-[10px] text-muted-foreground font-body">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Typography Section */}
      <div className="border-t border-border pt-5 space-y-4">
        <div className="flex items-center gap-2">
          <Type className="h-5 w-5 text-primary" />
          <h3 className="font-display font-semibold text-foreground">Typography</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="font-body font-semibold text-sm">Display Font</Label>
            <p className="text-xs text-muted-foreground font-body">Headings & titles</p>
            <Select
              value={draft.theme_font_display}
              onValueChange={(v) => setDraft({ ...draft, theme_font_display: v })}
            >
              <SelectTrigger className="font-body">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DISPLAY_FONTS.map((f) => (
                  <SelectItem key={f} value={f}>
                    <span style={{ fontFamily: `'${f}', serif` }}>{f}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p
              className="text-lg mt-2 text-foreground"
              style={{ fontFamily: `'${draft.theme_font_display}', serif` }}
            >
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
          <div className="space-y-1.5">
            <Label className="font-body font-semibold text-sm">Body Font</Label>
            <p className="text-xs text-muted-foreground font-body">Paragraphs & UI text</p>
            <Select
              value={draft.theme_font_body}
              onValueChange={(v) => setDraft({ ...draft, theme_font_body: v })}
            >
              <SelectTrigger className="font-body">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BODY_FONTS.map((f) => (
                  <SelectItem key={f} value={f}>
                    <span style={{ fontFamily: `'${f}', sans-serif` }}>{f}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p
              className="text-sm mt-2 text-foreground"
              style={{ fontFamily: `'${draft.theme_font_body}', sans-serif` }}
            >
              The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button onClick={handleSave} disabled={saving} className="font-body">
          {saving ? "Saving…" : "Save Theme"}
        </Button>
        <Button variant="outline" onClick={handleReset} className="font-body">
          <RotateCcw className="h-4 w-4 mr-1.5" />
          Reset Defaults
        </Button>
      </div>
    </div>
  );
}
