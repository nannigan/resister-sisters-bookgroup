

## Add Aceternity Moving Border Component

### What Changes

1. **Install `framer-motion`** as a dependency.

2. **Create `src/components/ui/moving-border.tsx`** with the full Aceternity Moving Border component source (the pasted code had its JSX stripped — I'll reconstruct the complete component from the known Aceternity source).

3. **Update `tailwind.config.ts`** to add the `addVariablesForColors` plugin, which exposes all Tailwind colors as CSS variables (needed for `var(--sky-500)` etc. in the radial gradient). The existing ESM config format will be preserved — no conversion to CommonJS.

### Technical Details

**moving-border.tsx** — Two exports:
- `Button` — wrapper component with animated border container (accepts `borderRadius`, `as`, `containerClassName`, `borderClassName`, `duration`, `className`)
- `MovingBorder` — the SVG + framer-motion animation that traces a rect path

**Tailwind plugin** — Added at the end of the plugins array:
```ts
function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
  addBase({ ":root": newVars });
}
```
Uses ESM import for `flattenColorPalette` from `tailwindcss/lib/util/flattenColorPalette`.

**Files modified:**
- `package.json` (add framer-motion)
- `src/components/ui/moving-border.tsx` (new file)
- `tailwind.config.ts` (add plugin + import)

