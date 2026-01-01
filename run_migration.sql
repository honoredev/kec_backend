-- Run this SQL directly in your Supabase SQL Editor
-- This will add the missing columns to your articles table

ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS left_column_content TEXT,
ADD COLUMN IF NOT EXISTS right_column_content TEXT,
ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS shares INTEGER DEFAULT 0;

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'articles' 
ORDER BY ordinal_position;