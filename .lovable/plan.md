# Admin Panel: Planning Fields

## Requested additions
- Add **Next meeting** with a calendar date picker.
- Hold the second field until its name and purpose are clarified. Do not add a Next Book picker.
- Place both together in the Admin Panel, matching the existing fonts, field backgrounds, and controls.
- Allow either value to remain empty or be cleared. Include a Save button with saving, success, and error feedback.
- Load saved selections when the Admin Panel opens and retain them after refreshing.

## Scope
The meeting date is a club-wide planning setting. Choosing a date will not change a book’s discussion date. Leave the existing Next Meeting banner unchanged in this addition.

## Technical details
- Confirm the live settings schema before applying an additive migration for a nullable `next_meeting_date` field on `app_settings`. Plan storage for the second field after clarification.
- Read and update only the planning fields and settings row ID; do not modify theme settings or access tokens.
- Use the existing Shadcn calendar/popover controls with an interactive calendar wrapper. Store the date as a date-only value to avoid timezone shifts.
- Preserve the existing Admin Panel access behavior; this work does not redesign authentication or database permissions.

## Verification
- Test saving and clearing the meeting date and date-only round trips. Add verification for the second field once clarified.
- Verify the Admin Panel flow: pick a date, save, refresh, and confirm it remains.
- Check the controls on desktop and mobile and confirm the existing banner and book statuses remain unchanged.