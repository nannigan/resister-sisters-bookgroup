

## Import 83 Books from CSV

Replace the single existing book record with all 83 books from your new CSV file.

### Data Overview

The CSV contains 83 book entries spanning from April 2017 to January 2026. The data is well-structured with clean title/author separation. A few items to note:

- **Status**: All entries are "read", which maps to **"finished"** in the database.
- **Meeting dates**: Most use M-D-YYYY format (e.g., "4-26-2017") and will be converted to proper dates (2017-04-26). One entry ("12-19 to 1-20") will be set to **2019-12-19**. One entry (last row) has an empty date and will be set to NULL.
- **Missing authors**: Row 77 ("The Green New Deal") has no author -- will be set to **"Unknown"**.
- **Page counts**: Only ~10 books have page counts; the rest will default to **0**.
- **Publication dates**: Only a handful are provided; the rest will be empty strings.
- **Split books**: Some books are split into 1st/2nd half with separate meeting dates -- these remain as separate rows.
- **Nominator, link, comments**: All blank/null as provided.

### Steps

1. **Delete** the 1 existing book record from the database.
2. **Insert all 83 books** with cleaned and normalized data:
   - Convert all meeting dates to YYYY-MM-DD format
   - Map "read" status to "finished"
   - Set missing page counts to 0
   - Set missing author to "Unknown"

### Technical Details

- Uses the database insert tool (not migrations) since this is a data operation, not a schema change.
- No code changes needed -- the existing `useBooks.ts` hook and page components already support all these fields.
- The insert will be done in batches to ensure reliability.

**Files modified:** None (data-only operation)

