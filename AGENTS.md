# Architecture rules
- Keep club planning settings in `app_settings` and access them through a dedicated hook; this isolates planning updates from theme and access-token fields.
- Store the next book picker as a nullable member foreign key with deletion clearing; this represents the person choosing the book without changing membership or books.