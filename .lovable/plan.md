

## Add "Brief Summary" Column to Books Table

### What Changes

1. **Database migration**: Add a nullable `brief_summary` text column to the `books` table (positioned logically before `comment` in the schema).

2. **BookDetail.tsx**: Add a "Brief Summary" textarea field between the Link field and Group Notes field. Include it in the form state, data loading, and save logic.

3. **useBooks.ts**: Add `brief_summary` to the `Book` interface and `BookInsert` type.

4. **BookList.tsx**: No changes needed (brief summary doesn't need to appear in the table list view).

### Technical Details

- **Migration SQL**: `ALTER TABLE public.books ADD COLUMN brief_summary text;`
- **Form field**: Textarea with placeholder like "A brief summary of the book…", max ~500 characters
- **Hook update**: Add `brief_summary: string | null` to the Book interface

**Files modified:** 
- New migration file (schema change)
- `src/hooks/useBooks.ts` (interface update)
- `src/pages/BookDetail.tsx` (form field + state)

