# Match meeting details color to "Currently Suggested" blue

On the Books page, the "Next meeting" and "Next book picker" lines under the title will use the same blue as the "Currently Suggested" status label text (#3693ab), for both the bold labels and their values.

## Technical details
- `src/pages/BookList.tsx`: replace `text-foreground` on the "Meeting planning" container with a shared class.
- `src/index.css`: add a `.planning-details-text` component class using the same color as `.status-badge-candidate`, so the two stay in one place.
- Verify with a Playwright screenshot of the title area on desktop and mobile.
