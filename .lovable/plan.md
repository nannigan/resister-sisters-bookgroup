Add a total book count next to the filter dropdowns on `/books`.

## What

In `src/pages/BookList.tsx`, inside the filter row (`<div className="flex flex-wrap items-center gap-3">`), append a text element after the Category select showing `{books.length} books`.

## Styling

- `font-body text-sm text-muted-foreground`
- Use `ml-auto` so it sits at the end of the row on wider screens and wraps gracefully on mobile.

## Notes

- Uses the unfiltered `books` array length from `useBooks()`.
- No schema or business-logic changes.