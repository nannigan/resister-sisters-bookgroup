ALTER TABLE books RENAME COLUMN meeting_month TO meeting_date;
ALTER TABLE books ALTER COLUMN meeting_date TYPE date USING meeting_date::date;