-- Add missing columns to articles table
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS left_column_content TEXT,
ADD COLUMN IF NOT EXISTS right_column_content TEXT,
ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS shares INTEGER DEFAULT 0;