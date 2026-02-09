
## Rename "Meeting Month" to "Meeting Date" (Full Date)

Change the `meeting_month` column to `meeting_date` and store a proper date (month, day, year) instead of a free-text month string. The input will use a date picker for easy selection, and the display will show a formatted date like "March 15, 2026".

### What Changes

- The field currently labeled "Meeting Month" becomes **"Meeting Date"** everywhere in the app.
- Instead of typing free text like "March 2026", you will use a **calendar date picker** to select a full date (month, day, year).
- The book list table column header changes from "Meeting" to "Meeting Date", and dates display in a readable format (e.g., "Mar 15, 2026").
- Sorting by "Meeting Date" will sort chronologically by actual date instead of alphabetically.

### Technical Details

**1. Database migration**

Rename the column `meeting_month` to `meeting_date` and change its type from `text` to `date`:

```sql
ALTER TABLE books RENAME COLUMN meeting_month TO meeting_date;
ALTER TABLE books ALTER COLUMN meeting_date TYPE date USING meeting_date::date;
```

Since the only existing book has a null value for this column, the type conversion is safe.

**2. Update `src/hooks/useBooks.ts`**

- Rename the `meeting_month` field to `meeting_date` in the `Book` interface and `BookInsert` type.

**3. Update `src/pages/BookDetail.tsx`**

- Rename all `meeting_month` references in the form state to `meeting_date`.
- Replace the text input for "Meeting Month" with a **date picker** (using the existing Popover + Calendar components from shadcn).
- The date picker stores the value as a `YYYY-MM-DD` string for the database.
- Label changes from "Meeting Month" to "Meeting Date".
- Placeholder changes to "Pick a date".

**4. Update `src/pages/BookList.tsx`**

- Rename all `meeting_month` references to `meeting_date`.
- Update the sort key type and sort logic to compare dates chronologically instead of alphabetically.
- Update the table column header from "Meeting" to "Meeting Date".
- Format the displayed date using `date-fns` `format()` for readable output (e.g., "Mar 15, 2026").
- Update the sort dropdown label from "Meeting Month" to "Meeting Date".

**5. No changes needed to `src/integrations/supabase/types.ts`**

This file is auto-generated and will update automatically after the migration.

**Files modified:**
- New migration SQL file
- `src/hooks/useBooks.ts`
- `src/pages/BookDetail.tsx`
- `src/pages/BookList.tsx`
