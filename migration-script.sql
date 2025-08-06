-- Readtention v2 - Database Migration Script
-- Safely migrates from current schema to authentication-ready schema
-- Date: 2025-01-05

-- =============================================================================
-- PHASE 1: CREATE NEW TABLES (without dropping existing ones)
-- =============================================================================

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  learning_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Create enhanced books table
CREATE TABLE IF NOT EXISTS books_new (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT,
  cover_url TEXT,
  description TEXT,
  publisher TEXT,
  publication_date DATE,
  page_count INTEGER,
  language TEXT DEFAULT 'en',
  categories TEXT[] DEFAULT '{}',
  open_library_id TEXT,
  goodreads_id TEXT,
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  reading_status TEXT DEFAULT 'want_to_read' CHECK (reading_status IN ('want_to_read', 'reading', 'completed', 'paused')),
  started_reading_at TIMESTAMP WITH TIME ZONE,
  completed_reading_at TIMESTAMP WITH TIME ZONE,
  reading_notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  -- Migration fields to track old data
  old_book_id UUID, -- Reference to original book ID for migration
  migrated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create enhanced messages table
CREATE TABLE IF NOT EXISTS messages_new (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books_new(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'ai', 'system')),
  content TEXT NOT NULL,
  type TEXT DEFAULT 'message' CHECK (type IN ('message', 'welcome', 'loading', 'error', 'milestone')),
  conversation_stage TEXT DEFAULT 'general' CHECK (conversation_stage IN ('welcome', 'central', 'branches', 'subbranches', 'refinement', 'general')),
  metadata JSONB DEFAULT '{}',
  parent_message_id UUID REFERENCES messages_new(id) ON DELETE SET NULL,
  -- Migration fields
  old_message_id UUID,
  old_book_reference TEXT, -- Store old book_id reference
  migrated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create notes table (new)
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books_new(id) ON DELETE CASCADE,
  title TEXT,
  themes TEXT,
  quotes TEXT,
  takeaways TEXT,
  key_insights TEXT,
  practical_applications TEXT,
  personal_reflections TEXT,
  page_references TEXT,
  tags TEXT[] DEFAULT '{}',
  note_type TEXT DEFAULT 'general' CHECK (note_type IN ('general', 'chapter', 'quote', 'insight', 'question')),
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create mindmaps table (new)
CREATE TABLE IF NOT EXISTS mindmaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books_new(id) ON DELETE CASCADE,
  note_id UUID REFERENCES notes(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  mindmap_type TEXT DEFAULT 'ai_generated' CHECK (mindmap_type IN ('ai_generated', 'user_created', 'collaborative')),
  generation_prompt TEXT,
  ai_model TEXT DEFAULT 'gpt-4',
  version INTEGER DEFAULT 1,
  is_template BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create analytics tables
CREATE TABLE IF NOT EXISTS reading_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books_new(id) ON DELETE CASCADE,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  session_end TIMESTAMP WITH TIME ZONE,
  pages_read INTEGER DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  reading_speed_wpm DECIMAL,
  comprehension_score DECIMAL CHECK (comprehension_score >= 0 AND comprehension_score <= 10),
  mood_before TEXT CHECK (mood_before IN ('excited', 'curious', 'neutral', 'tired', 'stressed')),
  mood_after TEXT CHECK (mood_after IN ('inspired', 'satisfied', 'confused', 'enlightened', 'neutral')),
  environment TEXT CHECK (environment IN ('home', 'library', 'commute', 'cafe', 'outdoor', 'other')),
  device_type TEXT CHECK (device_type IN ('physical_book', 'ebook', 'audiobook', 'web')),
  notes_taken INTEGER DEFAULT 0,
  highlights_made INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_book_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books_new(id) ON DELETE CASCADE,
  total_reading_time_minutes INTEGER DEFAULT 0,
  total_pages_read INTEGER DEFAULT 0,
  average_session_length_minutes DECIMAL DEFAULT 0,
  reading_consistency_score DECIMAL DEFAULT 0,
  comprehension_trend DECIMAL DEFAULT 0,
  mindmaps_generated INTEGER DEFAULT 0,
  notes_count INTEGER DEFAULT 0,
  last_reading_session TIMESTAMP WITH TIME ZONE,
  estimated_completion_date DATE,
  learning_efficiency_score DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, book_id)
);

-- =============================================================================
-- PHASE 2: CREATE INDEXES
-- =============================================================================

-- Books indexes
CREATE INDEX IF NOT EXISTS idx_books_new_user_id ON books_new(user_id);
CREATE INDEX IF NOT EXISTS idx_books_new_old_id ON books_new(old_book_id);
CREATE INDEX IF NOT EXISTS idx_books_new_reading_status ON books_new(reading_status);
CREATE INDEX IF NOT EXISTS idx_books_new_categories ON books_new USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_books_new_title_search ON books_new USING GIN(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_books_new_author_search ON books_new USING GIN(to_tsvector('english', author));

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_new_user_book ON messages_new(user_id, book_id);
CREATE INDEX IF NOT EXISTS idx_messages_new_book_created ON messages_new(book_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_new_old_id ON messages_new(old_message_id);

-- Notes indexes
CREATE INDEX IF NOT EXISTS idx_notes_user_book ON notes(user_id, book_id);
CREATE INDEX IF NOT EXISTS idx_notes_tags ON notes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_notes_search ON notes USING GIN(to_tsvector('english', title || ' ' || themes || ' ' || takeaways));

-- Mindmaps indexes
CREATE INDEX IF NOT EXISTS idx_mindmaps_user_book ON mindmaps(user_id, book_id);
CREATE INDEX IF NOT EXISTS idx_mindmaps_book_id ON mindmaps(book_id);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_reading_sessions_user ON reading_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_book ON reading_sessions(book_id);
CREATE INDEX IF NOT EXISTS idx_user_book_analytics_user ON user_book_analytics(user_id);

-- =============================================================================
-- PHASE 3: MIGRATION FUNCTIONS
-- =============================================================================

-- Function to migrate books data (when user is authenticated)
CREATE OR REPLACE FUNCTION migrate_user_books(target_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  book_record RECORD;
  new_book_id UUID;
  migrated_count INTEGER := 0;
BEGIN
  -- Migrate books that don't have user_id (orphaned books)
  FOR book_record IN 
    SELECT * FROM books 
    WHERE user_id IS NULL OR user_id = target_user_id
  LOOP
    -- Insert into new books table
    INSERT INTO books_new (
      user_id, title, author, old_book_id, migrated_at, created_at
    ) VALUES (
      target_user_id, 
      book_record.title, 
      book_record.author, 
      book_record.id, 
      NOW(),
      COALESCE(book_record.created_at, NOW())
    ) 
    RETURNING id INTO new_book_id;
    
    -- Migrate associated messages
    UPDATE messages 
    SET book_id = new_book_id::TEXT
    WHERE book_id = book_record.id::TEXT;
    
    migrated_count := migrated_count + 1;
  END LOOP;
  
  RETURN migrated_count;
END;
$$ LANGUAGE plpgsql;

-- Function to migrate messages for a user
CREATE OR REPLACE FUNCTION migrate_user_messages(target_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  message_record RECORD;
  target_book_id UUID;
  migrated_count INTEGER := 0;
BEGIN
  FOR message_record IN 
    SELECT * FROM messages 
    WHERE user_id IS NULL OR user_id = target_user_id
  LOOP
    -- Find the corresponding new book ID
    SELECT id INTO target_book_id 
    FROM books_new 
    WHERE old_book_id::TEXT = message_record.book_id OR id::TEXT = message_record.book_id
    LIMIT 1;
    
    IF target_book_id IS NOT NULL THEN
      INSERT INTO messages_new (
        user_id, book_id, role, content, type, old_message_id, 
        old_book_reference, migrated_at, created_at
      ) VALUES (
        target_user_id,
        target_book_id,
        message_record.role,
        message_record.content,
        COALESCE(message_record.type, 'message'),
        message_record.id,
        message_record.book_id,
        NOW(),
        COALESCE(message_record.created_at, NOW())
      );
      
      migrated_count := migrated_count + 1;
    END IF;
  END LOOP;
  
  RETURN migrated_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- PHASE 4: TRIGGERS AND FUNCTIONS
-- =============================================================================

-- Updated trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE OR REPLACE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_books_new_updated_at 
  BEFORE UPDATE ON books_new 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_messages_new_updated_at 
  BEFORE UPDATE ON messages_new 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_notes_updated_at 
  BEFORE UPDATE ON notes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_mindmaps_updated_at 
  BEFORE UPDATE ON mindmaps 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- PHASE 5: VIEWS FOR COMPATIBILITY
-- =============================================================================

-- Create a view that maintains compatibility with old queries
CREATE OR REPLACE VIEW books_legacy_view AS
SELECT 
  old_book_id as id,
  user_id,
  title,
  author,
  created_at
FROM books_new
WHERE old_book_id IS NOT NULL;

-- =============================================================================
-- PHASE 6: MANUAL MIGRATION STEPS
-- =============================================================================

-- After authentication is implemented, run these commands:

-- 1. Create a default user for existing data (temporary)
-- INSERT INTO auth.users (id, email) VALUES ('00000000-0000-0000-0000-000000000000', 'anonymous@readtention.com');

-- 2. Migrate existing books
-- SELECT migrate_user_books('00000000-0000-0000-0000-000000000000');

-- 3. Migrate existing messages  
-- SELECT migrate_user_messages('00000000-0000-0000-0000-000000000000');

-- 4. Verify migration
-- SELECT COUNT(*) FROM books_new WHERE migrated_at IS NOT NULL;
-- SELECT COUNT(*) FROM messages_new WHERE migrated_at IS NOT NULL;

-- =============================================================================
-- PHASE 7: CLEANUP (Run after successful migration and testing)
-- =============================================================================

-- These commands should be run ONLY after verifying the migration was successful:

-- Drop old tables (CAREFUL!)
-- DROP TABLE IF EXISTS messages CASCADE;
-- DROP TABLE IF EXISTS books CASCADE;

-- Rename new tables to final names
-- ALTER TABLE books_new RENAME TO books;
-- ALTER TABLE messages_new RENAME TO messages;

-- Update indexes to match new table names
-- DROP INDEX IF EXISTS idx_books_new_user_id;
-- CREATE INDEX idx_books_user_id ON books(user_id);
-- ... (update all other indexes)

-- Drop migration-specific columns
-- ALTER TABLE books DROP COLUMN IF EXISTS old_book_id;
-- ALTER TABLE books DROP COLUMN IF EXISTS migrated_at;
-- ALTER TABLE messages DROP COLUMN IF EXISTS old_message_id;
-- ALTER TABLE messages DROP COLUMN IF EXISTS old_book_reference;
-- ALTER TABLE messages DROP COLUMN IF EXISTS migrated_at;

-- =============================================================================
-- NOTES FOR IMPLEMENTATION
-- =============================================================================

-- 1. Run this migration in a staging environment first
-- 2. Test thoroughly with real user authentication
-- 3. Back up all data before running in production
-- 4. Consider running the migration in phases during low-traffic periods
-- 5. Monitor performance after migration
-- 6. Have a rollback plan ready