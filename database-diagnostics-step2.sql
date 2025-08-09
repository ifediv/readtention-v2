-- Readtention v2 - Database Structure Check
-- Run these queries one at a time to see what columns each table has

-- =============================================================================
-- QUERY 1: Check NOTES table structure
-- =============================================================================
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'notes'
ORDER BY ordinal_position;

-- Expected columns should include:
-- id, user_id, book_id, themes, quotes, takeaways, created_at, updated_at

-- =============================================================================
-- QUERY 2: Check MINDMAPS table structure  
-- =============================================================================
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'mindmaps'
ORDER BY ordinal_position;

-- Expected columns should include:
-- id, user_id, book_id, title, content, mindmap_type, created_at, updated_at

-- =============================================================================
-- QUERY 3: Check INSIGHTS table structure (bonus table!)
-- =============================================================================
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'insights'
ORDER BY ordinal_position;

-- This is a mystery table - let's see what it contains!