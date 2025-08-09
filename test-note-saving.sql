-- Test Note Saving Manually
-- This will help us understand what might be going wrong

-- =============================================================================
-- TEST 1: Try inserting a note manually with one of your book IDs
-- =============================================================================
-- Replace the book_id with one of your actual book IDs from the previous query

INSERT INTO notes (
    book_id,
    themes,
    quotes, 
    takeaways
) VALUES (
    '3ae12048-7816-48f4-85f7-5b83dff47595'::uuid,  -- Replace with your book ID
    'Test theme from SQL',
    'Test quote from SQL',
    'Test takeaway from SQL'
);

-- If this works, it means the table is fine and the issue is in the JavaScript
-- If this fails, the error message will tell us what's wrong

-- =============================================================================
-- TEST 2: Check if the note was saved
-- =============================================================================
SELECT * FROM notes ORDER BY created_at DESC LIMIT 1;

-- =============================================================================
-- TEST 3: Check if user_id being NULL is an issue
-- =============================================================================
-- Let's see if any columns have NOT NULL constraints
SELECT 
    column_name,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'notes'
AND is_nullable = 'NO'
ORDER BY ordinal_position;