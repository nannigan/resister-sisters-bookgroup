

## Plan: Store `submitted_by` when suggesting a topic

**What changes**: When a user submits a new topic, automatically save the logged-in member's name in the `submitted_by` column of the `topics` table.

### Steps

1. **Edit `src/components/SuggestTopicDialog.tsx`**:
   - Import `useAuth` hook
   - Get `member` from the auth context
   - On insert, include `submitted_by: member?.name ?? null` in the insert payload

That's it — the `submitted_by` column already exists and is nullable, and the auth context already provides the member's name. No database changes needed.

