-- Readtention v2 - Functionality Test Queries
-- Run these to test if your tables work properly

-- =============================================================================
-- TEST 1: Check if there's any data in your tables
-- =============================================================================
SELECT 
    'books' as table_name, 
    COUNT(*) as row_count 
FROM books
UNION ALL
SELECT 
    'notes' as table_name, 
    COUNT(*) as row_count 
FROM notes
UNION ALL
SELECT 
    'mindmaps' as table_name, 
    COUNT(*) as row_count 
FROM mindmaps
UNION ALL
SELECT 
    'messages' as table_name, 
    COUNT(*) as row_count 
FROM messages;

-- This shows how many records are in each table

-- =============================================================================
-- TEST 2: Try inserting a test note (safe test)
-- =============================================================================
-- First, let's get a book_id from your books table
SELECT id, title FROM books LIMIT 1;

-- If you have a book, copy its ID and use it in the next query
-- If no books exist, that might be why notes aren't saving!

-- =============================================================================
-- TEST 3: Check recent notes (if any exist)
-- =============================================================================
SELECT 
    n.id,
    n.themes,
    n.quotes,
    n.takeaways,
    b.title as book_title,
    n.created_at
FROM notes n
LEFT JOIN books b ON n.book_id = b.id
ORDER BY n.created_at DESC
LIMIT 5;

-- This shows your most recent notes with their book titles