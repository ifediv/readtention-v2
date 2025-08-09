-- Readtention v2 - Database Diagnostic Queries
-- Run these one at a time in Supabase SQL Editor
-- https://supabase.com/dashboard/project/cchonlmfagkonsohrudq/sql

-- =============================================================================
-- QUERY 1: List all tables in your database
-- =============================================================================
-- This shows what tables actually exist in your database right now

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Expected results might include:
-- books
-- messages  
-- notes (we know this exists from your error)
-- mindmaps (we need to check if this exists)

-- Copy the results and share them so we know what's missing!