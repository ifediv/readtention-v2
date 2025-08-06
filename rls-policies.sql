-- Readtention v2 - Row Level Security Policies
-- Comprehensive RLS setup for authentication-ready database
-- Date: 2025-01-05

-- =============================================================================
-- ENABLE ROW LEVEL SECURITY ON ALL USER-DATA TABLES
-- =============================================================================

-- Enable RLS on existing tables
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Enable RLS on new tables (when they exist)
-- ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE mindmaps ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- BOOKS TABLE POLICIES
-- =============================================================================

-- Allow users to view their own books
CREATE POLICY "Users can view own books" ON books
  FOR SELECT USING (
    auth.uid() = user_id OR 
    user_id IS NULL -- Temporary: allow access to books without user_id (existing data)
  );

-- Allow users to insert their own books
CREATE POLICY "Users can insert own books" ON books
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    (auth.uid() IS NOT NULL AND user_id IS NULL) -- Allow setting user_id during insert
  );

-- Allow users to update their own books
CREATE POLICY "Users can update own books" ON books
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    (user_id IS NULL AND auth.uid() IS NOT NULL) -- Allow claiming orphaned books
  ) WITH CHECK (
    auth.uid() = user_id
  );

-- Allow users to delete their own books
CREATE POLICY "Users can delete own books" ON books
  FOR DELETE USING (
    auth.uid() = user_id
  );

-- =============================================================================
-- MESSAGES TABLE POLICIES
-- =============================================================================

-- Allow users to view their own messages
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (
    auth.uid() = user_id OR 
    user_id IS NULL OR -- Temporary: existing messages without user_id
    EXISTS (
      SELECT 1 FROM books 
      WHERE books.id::TEXT = messages.book_id 
      AND (books.user_id = auth.uid() OR books.user_id IS NULL)
    )
  );

-- Allow users to insert their own messages
CREATE POLICY "Users can insert own messages" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    (auth.uid() IS NOT NULL AND user_id IS NULL) OR -- Allow setting user_id during insert
    EXISTS (
      SELECT 1 FROM books 
      WHERE books.id::TEXT = messages.book_id 
      AND (books.user_id = auth.uid() OR books.user_id IS NULL)
    )
  );

-- Allow users to update their own messages
CREATE POLICY "Users can update own messages" ON messages
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    (user_id IS NULL AND auth.uid() IS NOT NULL) -- Allow claiming orphaned messages
  ) WITH CHECK (
    auth.uid() = user_id
  );

-- Allow users to delete their own messages
CREATE POLICY "Users can delete own messages" ON messages
  FOR DELETE USING (
    auth.uid() = user_id
  );

-- =============================================================================
-- NOTES TABLE POLICIES (for when table is created)
-- =============================================================================

-- Template for notes table policies:
/*
CREATE POLICY "Users can view own notes" ON notes
  FOR SELECT USING (
    auth.uid() = user_id OR 
    user_id IS NULL OR -- Temporary: existing notes without user_id
    is_public = TRUE -- Allow viewing public notes
  );

CREATE POLICY "Users can insert own notes" ON notes
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    (auth.uid() IS NOT NULL AND user_id IS NULL) -- Allow setting user_id during insert
  );

CREATE POLICY "Users can update own notes" ON notes
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    (user_id IS NULL AND auth.uid() IS NOT NULL) -- Allow claiming orphaned notes
  ) WITH CHECK (
    auth.uid() = user_id
  );

CREATE POLICY "Users can delete own notes" ON notes
  FOR DELETE USING (
    auth.uid() = user_id
  );
*/

-- =============================================================================
-- MINDMAPS TABLE POLICIES (for when table is created)
-- =============================================================================

-- Template for mindmaps table policies:
/*
CREATE POLICY "Users can view own mindmaps" ON mindmaps
  FOR SELECT USING (
    auth.uid() = user_id OR 
    user_id IS NULL OR -- Temporary: existing mindmaps without user_id
    is_public = TRUE OR -- Allow viewing public mindmaps
    is_template = TRUE -- Allow viewing template mindmaps
  );

CREATE POLICY "Users can insert own mindmaps" ON mindmaps
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    (auth.uid() IS NOT NULL AND user_id IS NULL) -- Allow setting user_id during insert
  );

CREATE POLICY "Users can update own mindmaps" ON mindmaps
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    (user_id IS NULL AND auth.uid() IS NOT NULL) -- Allow claiming orphaned mindmaps
  ) WITH CHECK (
    auth.uid() = user_id
  );

CREATE POLICY "Users can delete own mindmaps" ON mindmaps
  FOR DELETE USING (
    auth.uid() = user_id
  );
*/

-- =============================================================================
-- FUNCTIONS TO HELP WITH DATA MIGRATION AND USER ASSIGNMENT
-- =============================================================================

-- Function to assign existing data to a user when they authenticate
CREATE OR REPLACE FUNCTION assign_orphaned_data_to_user(target_user_id UUID)
RETURNS JSON AS $$
DECLARE
  books_updated INTEGER := 0;
  messages_updated INTEGER := 0;
  result JSON;
BEGIN
  -- Update books without user_id
  UPDATE books 
  SET user_id = target_user_id, updated_at = NOW()
  WHERE user_id IS NULL;
  
  GET DIAGNOSTICS books_updated = ROW_COUNT;
  
  -- Update messages without user_id
  UPDATE messages 
  SET user_id = target_user_id, updated_at = NOW()
  WHERE user_id IS NULL;
  
  GET DIAGNOSTICS messages_updated = ROW_COUNT;
  
  -- When notes and mindmaps tables exist, add similar updates:
  /*
  UPDATE notes 
  SET user_id = target_user_id, updated_at = NOW()
  WHERE user_id IS NULL;
  
  UPDATE mindmaps 
  SET user_id = target_user_id, updated_at = NOW()
  WHERE user_id IS NULL;
  */
  
  result := json_build_object(
    'books_assigned', books_updated,
    'messages_assigned', messages_updated,
    'user_id', target_user_id,
    'assigned_at', NOW()
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has access to specific book
CREATE OR REPLACE FUNCTION user_can_access_book(book_uuid UUID, target_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  check_user_id UUID;
BEGIN
  -- Use provided user_id or current authenticated user
  check_user_id := COALESCE(target_user_id, auth.uid());
  
  -- Check if user owns the book or book is orphaned
  RETURN EXISTS (
    SELECT 1 FROM books 
    WHERE id = book_uuid 
    AND (user_id = check_user_id OR user_id IS NULL)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- TEMPORARY POLICIES FOR DEVELOPMENT (Remove in production)
-- =============================================================================

-- Allow all access when no authentication is present (for development)
-- Remove these policies when authentication is fully implemented

CREATE POLICY "Dev: Allow all access to books when not authenticated" ON books
  FOR ALL USING (auth.uid() IS NULL);

CREATE POLICY "Dev: Allow all access to messages when not authenticated" ON messages
  FOR ALL USING (auth.uid() IS NULL);

-- =============================================================================
-- VIEWS WITH RLS SUPPORT
-- =============================================================================

-- User's book library with RLS
CREATE OR REPLACE VIEW user_books_with_stats AS
SELECT 
  b.*,
  COUNT(DISTINCT m.id) as message_count,
  MAX(m.created_at) as last_message_at,
  CASE 
    WHEN COUNT(DISTINCT m.id) > 10 THEN 'Active Discussion'
    WHEN COUNT(DISTINCT m.id) > 0 THEN 'Started'
    ELSE 'Not Started'
  END as engagement_level
FROM books b
LEFT JOIN messages m ON b.id::TEXT = m.book_id AND (
  m.user_id = auth.uid() OR 
  m.user_id IS NULL OR 
  auth.uid() IS NULL
)
WHERE 
  b.user_id = auth.uid() OR 
  b.user_id IS NULL OR 
  auth.uid() IS NULL
GROUP BY b.id, b.user_id, b.title, b.author, b.created_at, b.updated_at
ORDER BY last_message_at DESC NULLS LAST, b.created_at DESC;

-- =============================================================================
-- HELPER FUNCTIONS FOR APPLICATION
-- =============================================================================

-- Function to safely create a book for current user
CREATE OR REPLACE FUNCTION create_user_book(
  book_title TEXT,
  book_author TEXT,
  current_user_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_book_id UUID;
  target_user_id UUID;
BEGIN
  -- Use provided user_id or current authenticated user
  target_user_id := COALESCE(current_user_id, auth.uid());
  
  INSERT INTO books (title, author, user_id)
  VALUES (book_title, book_author, target_user_id)
  RETURNING id INTO new_book_id;
  
  RETURN new_book_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to safely create a message for current user
CREATE OR REPLACE FUNCTION create_user_message(
  target_book_id UUID,
  message_role TEXT,
  message_content TEXT,
  message_type TEXT DEFAULT 'message',
  current_user_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_message_id UUID;
  target_user_id UUID;
BEGIN
  -- Use provided user_id or current authenticated user
  target_user_id := COALESCE(current_user_id, auth.uid());
  
  -- Verify user can access the book
  IF NOT user_can_access_book(target_book_id, target_user_id) THEN
    RAISE EXCEPTION 'User does not have access to this book';
  END IF;
  
  INSERT INTO messages (book_id, role, content, type, user_id)
  VALUES (target_book_id::TEXT, message_role, message_content, message_type, target_user_id)
  RETURNING id INTO new_message_id;
  
  RETURN new_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- MIGRATION TRIGGER FOR NEW USERS
-- =============================================================================

-- Trigger function to assign orphaned data to new users
CREATE OR REPLACE FUNCTION handle_new_user_data_assignment()
RETURNS TRIGGER AS $$
BEGIN
  -- When a new user signs up, assign any orphaned data to them if no other users exist
  -- This is primarily for transitioning from non-auth to auth system
  
  IF (SELECT COUNT(*) FROM auth.users) = 1 THEN
    -- This is likely the first user, assign all orphaned data
    PERFORM assign_orphaned_data_to_user(NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- This trigger will be created when auth is fully implemented:
-- CREATE TRIGGER on_first_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION handle_new_user_data_assignment();

-- =============================================================================
-- VERIFICATION AND TESTING QUERIES
-- =============================================================================

-- Test queries to verify RLS is working correctly:

-- Check current policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename IN ('books', 'messages');

-- Test book access without authentication
-- SELECT * FROM books LIMIT 5;

-- Test with simulated user (when auth is implemented)
-- SET request.jwt.claim.sub = 'user-uuid-here';
-- SELECT * FROM books;

-- =============================================================================
-- DEPLOYMENT NOTES
-- =============================================================================

-- 1. Run this script after creating the basic tables
-- 2. Test thoroughly in staging environment
-- 3. The development policies should be removed in production
-- 4. Monitor query performance with RLS enabled
-- 5. Consider creating additional indexes based on RLS filter patterns

SELECT 'RLS policies setup completed successfully' as status;