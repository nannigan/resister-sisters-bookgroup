

## Mobile-friendly navigation

On mobile (<640px) the header is overflowing because the long brand title, search input, 4–5 nav icons, and a sign-out button all sit in one row. We'll restructure the header to fit comfortably on small screens while keeping the desktop layout unchanged.

### What you'll see on mobile (<640px)

- **Compact brand**: book icon + short title "Resister Sisters" (full name returns at `sm:` and up).
- **Hamburger menu** (☰) on the right opens a slide-in drawer from the right side containing:
  - Full nav list with icon + label (Books, Topics, Vote, Members, Admin if applicable) — large tap targets
  - Sign out button at the bottom
- **Search**: moves to a second row directly under the header bar, full-width, so it stays accessible without crowding the top row.
- Active route is highlighted in the drawer the same way it is in the desktop nav.

### What stays the same on tablet/desktop (≥640px)

- Existing inline nav with icons + labels
- Inline search box
- Sign-out icon button
- No visual change

### Layout sketch

```text
Mobile (<640px):
┌──────────────────────────────────────────┐
│ 📖 Resister Sisters                  ☰  │
│ [ 🔍 Search...                        ] │
└──────────────────────────────────────────┘

Drawer (opens from right):
┌───────────────────────┐
│ Menu              ✕   │
│ ─────────────────────  │
│ 📖 Books              │
│ 💡 Topics             │
│ 🗳  Vote              │
│ 👥 Members            │
│ ⚙  Admin              │
│ ─────────────────────  │
│ ⎋ Sign out            │
└───────────────────────┘

Desktop (≥640px) — unchanged:
┌─────────────────────────────────────────────────────────────┐
│ 📖 Resister Sisters Book Group   [🔍] Books Topics Vote ⎋  │
└─────────────────────────────────────────────────────────────┘
```

### Technical changes

- **`src/components/AppLayout.tsx`**
  - Add a `useState` for drawer open state.
  - Use the existing `Sheet` component (`src/components/ui/sheet.tsx`) for the mobile drawer, triggered by a `Menu` icon button shown only `sm:hidden`.
  - Hide the inline `<nav>`, inline `GlobalSearch`, and inline sign-out button on mobile via `hidden sm:flex`.
  - Render `GlobalSearch` in a second row inside the header that is `sm:hidden`, full-width.
  - Brand title: short text on mobile (`Resister Sisters`), full text from `sm:` upward, using `hidden sm:inline` / `sm:hidden` spans.
  - Tapping a nav item in the drawer closes the drawer (handled by wrapping `Link`s in `SheetClose asChild` or by toggling state on click).
- **`src/components/GlobalSearch.tsx`**
  - Make the input width responsive: `w-full sm:w-52` so it fills the mobile second row but stays compact on desktop.
  - Ensure the results dropdown still anchors correctly (already uses `left-0 right-0`, which is fine for full-width mobile).

No backend, routing, or styling-system changes required. All existing UI primitives (`Sheet`, `Button`) are already in the project.

