# Admin Panel: Planning Fields

## Requested additions
- Add **Next meeting** with a calendar date picker.
- Add **Next book picker** with a dropdown of member names, selecting the person who will choose the next book—not a book itself. Include all members, including the admin, ordered alphabetically.
- Place both together in the Admin Panel, matching the existing fonts, field backgrounds, and controls.
- Allow either value to remain empty or be cleared. Include a Save button with saving, success, and error feedback.
- Load saved selections when the Admin Panel opens and retain them after refreshing.

## Scope
These are club-wide planning settings. Choosing a date will not change a book’s discussion date, and selecting a member will not change their role or any book’s status. Leave the existing Next Meeting banner unchanged in this addition.

## Technical details
- Confirm the live settings schema before applying an additive migration for nullable `next_meeting_date` and `next_book_picker_member_id` fields on `app_settings`.
- Reference `members(id)` for the selected person, clearing the selection if that member is deleted. Reuse the existing member list and design-system Select control.
- Read and update only the planning fields and settings row ID; do not modify theme settings or access tokens.
- Use the existing Shadcn calendar/popover controls with an interactive calendar wrapper. Store the date as a date-only value to avoid timezone shifts.
- Preserve the existing Admin Panel access behavior; this work does not redesign authentication or database permissions.

## Verification
- Test saving and clearing both values, date-only round trips, and that the picker stores a member reference rather than a book reference.
- Verify the Admin Panel flow: pick a date and member, save, refresh, and confirm both selections remain.
- Check the controls on desktop and mobile and confirm the existing banner and book statuses remain unchanged.