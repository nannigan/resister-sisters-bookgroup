# Resistor Sisters Books — Project Documentation

## Overview

A private book-club web app for tracking suggested, current, and finished books, running ranked-choice votes on what to read next, brainstorming discussion topics, and managing members. Built with Vite + React + TypeScript + Tailwind CSS + shadcn/ui, backed by Lovable Cloud (managed Postgres + edge functions).

## Access & Authentication

- **Token gate** — first-time visitors must enter a shared access token, validated by the `validate-token` edge function. Admins can rotate the token via `regenerate-token`. See `src/components/TokenGate.tsx`.
- **Email-only login** — members log in by typing their email; the app looks them up in the `members` table. No passwords and no Supabase Auth are used. See `src/hooks/useAuth.tsx`.
- **Session** — stored in `localStorage`, expires after 7 days of inactivity.
- **RBAC** — two roles: `admin` and `member`. Admin is required for member management, the admin panel, deleting topics, and resetting votes.

## Routing & Pages

Flat routing defined in `src/App.tsx`; pages live in `src/pages/`.

| Route | Page | Purpose |
|---|---|---|
| `/` | redirect | Sends users to `/books` |
| `/books` | `BookList.tsx` | Searchable, filterable, sortable book table |
| `/books/:id` | `BookDetail.tsx` | Single-book view + edit |
| `/vote` | `Vote.tsx` | Ranked-choice ballot + leaderboard |
| `/topics` | `Topics.tsx` | Discussion-topic brainstorming |
| `/members` | `Members.tsx` | Member directory (admin manages) |
| `/admin` | `AdminPanel.tsx` | Theme, access token, vote resets |

`AppLayout.tsx` provides the shared chrome (nav, global search, next-meeting banner). `RequireAuth.tsx` guards authenticated routes.

## Data Model

Tables live in the `public` schema on Lovable Cloud. RLS is enabled with permissive policies (`USING true`) against the `anon` role — identity is enforced at the application layer via the custom email login.

- **`books`** — `title`, `author`, `status` (`candidate` | `current` | `finished` | `previously_suggested`), `category` (`political` | `fun`), `publication_date`, `page_count`, `meeting_date`, `meeting_time`, `brief_summary`, `nominator`, `comment`, `link`, `format` (`hardcover` | `paperback`), `library_available`.
- **`members`** — `name`, `email`, `phone`, `role`.
- **`topics`** — `title`, `description`, `submitted_by`.
- **`votes`** — `member_id`, `book_id`, `rank` (ranked-choice ballot row).
- **`app_settings`** — shared access token and theme tokens (colors, fonts, radius).

### Status display mapping (DB → UI)

| DB value | UI label | Notes |
|---|---|---|
| `current` | Currently Reading | Drives the next-meeting banner |
| `candidate` | Currently Suggested | Eligible for voting |
| `previously_suggested` | Previously Suggested | Archive; excluded from voting and banner |
| `finished` | Finished | Counted in the "books read" total |

Default sort order on `/books`: Currently Reading → Currently Suggested → Previously Suggested → Finished.

## Key Features

- **Book list** — field-specific search, status + category filters, clickable status badges for one-tap filtering, interactive column sorting (including last-name author sort), finished-book count, PDF export.
- **Ranked-choice voting** — members rank all `candidate` books; leaderboard tallies points where rank 1 = max points.
- **Next-meeting banner** — surfaces the nearest upcoming `current` book with its meeting date/time.
- **Topic suggestions** — collaborative brainstorming with inline editing; admins can delete.
- **Global search** — real-time categorized results across books, topics, and members.
- **Admin panel** — theme configurator, access-token rotation, and vote reset.

## Design System

- HSL semantic tokens defined in `src/index.css` and `tailwind.config.ts` — components never hardcode colors.
- `bg-amber-50` is the signature surface for interactive elements, headers, and badges.
- Default border radius: `0.5rem`.
- Theme values are stored in `app_settings` and applied at runtime via `ThemeProvider.tsx`; admins can edit them in `ThemeConfigurator.tsx`.

## Project Structure

```text
src/
  components/         shared UI (AppLayout, GlobalSearch, TokenGate, ThemeProvider, …)
    ui/               shadcn/ui primitives
  hooks/              useAuth, useBooks, useMembers, useVotes, useAppSettings, useThemeSettings
  pages/              BookList, BookDetail, Vote, Topics, Members, AdminPanel, Index, NotFound
  integrations/
    supabase/         auto-generated client + types (do not edit)
  index.css           design tokens
supabase/
  config.toml         project + per-function config
  functions/
    validate-token/   verifies the shared access token
    regenerate-token/ rotates the access token (admin only)
```

## Local Development

```sh
npm install
npm run dev
```

Environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`) are auto-wired by Lovable Cloud in `.env` and should not be edited by hand. Edge functions deploy automatically when changed.