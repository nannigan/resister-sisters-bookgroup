# Admin Panel: Next Meeting and Next Book

## Requested additions
- Add **Next meeting** with a calendar date picker.
- Add **Next Book** with a searchable picker of existing books, displaying title and author.
- Place both together in the Admin Panel, matching the existing fonts, field backgrounds, and controls.
- Allow either value to remain empty or be cleared. Include a Save button with saving, success, and error feedback.
- Load saved selections when the Admin Panel opens and retain them after refreshing.

## Scope
These are club-wide planning settings. Choosing a book will not change its status, and choosing a date will not change a book’s discussion date. Leave the existing Next Meeting banner unchanged in this addition.

## Technical details
- Confirm the live settings schema before applying an additive migration for nullable `next_meeting_date` and `next_book_id` fields on `app_settings`.
- Reference `books(id)` for the selected book, clearing that reference if the book is deleted.
- Read and update only the planning fields and settings row ID; do not modify theme settings or access tokens.
- Use the existing Shadcn calendar/popover controls with an interactive calendar wrapper. Store the date as a date-only value to avoid timezone shifts.
- Preserve the existing Admin Panel access behavior; this work does not redesign authentication or database permissions.

## Verification
- Test saving both selections, clearing either selection, and date-only round trips.
- Verify the Admin Panel flow: pick a date and book, save, refresh, and confirm both selections remain.
- Check the controls on desktop and mobile and confirm the existing banner and book statuses remain unchanged.