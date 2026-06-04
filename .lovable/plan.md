# Plan: Create `project_documentation.md`

Add a single new file at the project root: `project_documentation.md`. No code changes.

## Sections

1. **Overview** — Resistor Sisters Books: a private book-club app for tracking suggested/current/finished books, ranked-choice voting, discussion topics, and member management. Built on Vite + React + TypeScript + Tailwind + shadcn/ui, backed by Lovable Cloud.

2. **Access & Authentication**
   - Token gate on first visit (validated via `validate-token` edge function, regenerated via `regenerate-token`).
   - Email-only login against the `members` table (no passwords, no Supabase Auth).
   - LocalStorage session, 7-day inactivity expiry (`src/hooks/useAuth.tsx`).
   - RBAC: `admin` vs `member` — admin required for member management, admin panel, topic deletion, vote resets.

3. **Routing & Pages** (`src/pages/`)
   - `/` → redirects to `/books`
   - `/books`, `/books/:id` — list + detail
   - `/vote` — ranked-choice ballot
   - `/topics` — discussion-topic brainstorming
   - `/members` — directory (admin manages)
   - `/admin` — admin panel (theme, token, resets)

4. **Data Model** (Lovable Cloud / Postgres)
   - `books` — title, author, status (`candidate` | `current` | `finished` | `previously_suggested`), category (`political` | `fun`), publication_date, page_count, meeting_date/time, summary, nominator, comment, link, format, library_available.
   - `members` — name, email, phone, role.
   - `topics` — title, description, submitted_by.
   - `votes` — member_id, book_id, rank (ranked-choice).
   - `app_settings` — access token + theme tokens.
   - Status display mapping: candidate→"Currently Suggested", current→"Currently Reading", finished→"Finished", previously_suggested→"Previously Suggested" (archived, excluded from voting/banner).

5. **Key Features**
   - Book list: search, status/category filters, clickable status badges for one-tap filter, custom sort order (Currently Reading → Currently Suggested → Previously Suggested → Finished), finished-book count, PDF export.
   - Ranked-choice voting across `candidate` books with leaderboard.
   - Next-meeting banner for nearest upcoming `current` book.
   - Topic suggestions with collaborative editing.
   - Global search across books, topics, members.

6. **Design System**
   - HSL semantic tokens in `src/index.css` and `tailwind.config.ts`.
   - `bg-amber-50` for interactive surfaces, headers, badges; 0.5rem default radius.
   - Theme configurable from the admin panel via `app_settings`.

7. **Project Structure** — short tree of `src/` (components, hooks, pages, integrations) and `supabase/` (config + `validate-token`, `regenerate-token` edge functions).

8. **Local Development** — `npm i` then `npm run dev`; environment auto-wired via `.env` from Lovable Cloud.

## Out of scope
No code or schema changes — documentation only.
