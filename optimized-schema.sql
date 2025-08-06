-- Readtention v2 - Optimized Database Schema for Authentication
-- This schema is designed for user authentication, data isolation, and scalability
-- Date: 2025-01-05

-- =============================================================================
-- 1. USERS TABLE (managed by Supabase Auth, but we need a profile extension)
-- =============================================================================

-- User profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  learning_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- =============================================================================
-- 2. BOOKS TABLE (Enhanced with user ownership and metadata)
-- =============================================================================

-- Drop existing books table if it exists (for migration)
-- Note: In production, we'll need to migrate existing data first
-- DROP TABLE IF EXISTS books CASCADE;

-- Books table with proper user relationships and enhanced metadata
CREATE TABLE IF NOT EXISTS books_new (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
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
  open_library_id TEXT, -- For Open Library API integration
  goodreads_id TEXT,    -- For future Goodreads integration
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  reading_status TEXT DEFAULT 'want_to_read' CHECK (reading_status IN ('want_to_read', 'reading', 'completed', 'paused')),
  started_reading_at TIMESTAMP WITH TIME ZONE,
  completed_reading_at TIMESTAMP WITH TIME ZONE,
  reading_notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW') NOT NULL
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_books_user_id ON books_new(user_id);
CREATE INDEX IF NOT EXISTS idx_books_reading_status ON books_new(reading_status);
CREATE INDEX IF NOT EXISTS idx_books_categories ON books_new USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_books_title_search ON books_new USING GIN(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_books_author_search ON books_new USING GIN(to_tsvector('english', author));
CREATE INDEX IF NOT EXISTS idx_books_is_favorite ON books_new(user_id, is_favorite) WHERE is_favorite = TRUE;

-- =============================================================================
-- 3. MESSAGES TABLE (Enhanced chat system with conversation threading)
-- =============================================================================

-- Enhanced messages table with better structure
CREATE TABLE IF NOT EXISTS messages_new (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES books_new(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'ai', 'system')),
  content TEXT NOT NULL,
  type TEXT DEFAULT 'message' CHECK (type IN ('message', 'welcome', 'loading', 'error', 'milestone')),
  conversation_stage TEXT DEFAULT 'general' CHECK (conversation_stage IN ('welcome', 'central', 'branches', 'subbranches', 'refinement', 'general')),
  metadata JSONB DEFAULT '{}', -- For storing AI model info, tokens used, etc.
  parent_message_id UUID REFERENCES messages_new(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for efficient message retrieval
CREATE INDEX IF NOT EXISTS idx_messages_user_book ON messages_new(user_id, book_id);
CREATE INDEX IF NOT EXISTS idx_messages_book_created ON messages_new(book_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_stage ON messages_new(book_id, conversation_stage);
CREATE INDEX IF NOT EXISTS idx_messages_parent ON messages_new(parent_message_id);

-- =============================================================================
-- 4. NOTES TABLE (Structured note-taking system)
-- =============================================================================

CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES books_new(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  themes TEXT,
  quotes TEXT,
  takeaways TEXT,
  key_insights TEXT,
  practical_applications TEXT,
  personal_reflections TEXT,
  page_references TEXT, -- "p.45, p.120-125" etc.
  tags TEXT[] DEFAULT '{}',
  note_type TEXT DEFAULT 'general' CHECK (note_type IN ('general', 'chapter', 'quote', 'insight', 'question')),
  is_public BOOLEAN DEFAULT FALSE, -- For future sharing features
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for notes
CREATE INDEX IF NOT EXISTS idx_notes_user_book ON notes(user_id, book_id);
CREATE INDEX IF NOT EXISTS idx_notes_tags ON notes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_notes_type ON notes(note_type);
CREATE INDEX IF NOT EXISTS idx_notes_public ON notes(is_public) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_notes_search ON notes USING GIN(to_tsvector('english', title || ' ' || themes || ' ' || takeaways));

-- =============================================================================
-- 5. MINDMAPS TABLE (AI-generated and user mind maps)
-- =============================================================================

CREATE TABLE IF NOT EXISTS mindmaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES books_new(id) ON DELETE CASCADE NOT NULL,
  note_id UUID REFERENCES notes(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- Markdown content for Markmap
  mindmap_type TEXT DEFAULT 'ai_generated' CHECK (mindmap_type IN ('ai_generated', 'user_created', 'collaborative')),
  generation_prompt TEXT, -- Store the prompt used for AI generation
  ai_model TEXT DEFAULT 'gpt-4', -- Track which AI model was used
  version INTEGER DEFAULT 1,
  is_template BOOLEAN DEFAULT FALSE, -- For community templates
  is_public BOOLEAN DEFAULT FALSE,   -- For sharing
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}', -- Store generation metadata, render settings, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for mindmaps
CREATE INDEX IF NOT EXISTS idx_mindmaps_user_book ON mindmaps(user_id, book_id);
CREATE INDEX IF NOT EXISTS idx_mindmaps_book_id ON mindmaps(book_id);
CREATE INDEX IF NOT EXISTS idx_mindmaps_note_id ON mindmaps(note_id);
CREATE INDEX IF NOT EXISTS idx_mindmaps_type ON mindmaps(mindmap_type);
CREATE INDEX IF NOT EXISTS idx_mindmaps_public ON mindmaps(is_public) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_mindmaps_template ON mindmaps(is_template) WHERE is_template = TRUE;

-- =============================================================================
-- 6. READING_SESSIONS TABLE (Track reading progress and analytics)
-- =============================================================================

CREATE TABLE IF NOT EXISTS reading_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES books_new(id) ON DELETE CASCADE NOT NULL,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  session_end TIMESTAMP WITH TIME ZONE,
  pages_read INTEGER DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  reading_speed_wpm DECIMAL, -- words per minute
  comprehension_score DECIMAL CHECK (comprehension_score >= 0 AND comprehension_score <= 10),
  mood_before TEXT CHECK (mood_before IN ('excited', 'curious', 'neutral', 'tired', 'stressed')),
  mood_after TEXT CHECK (mood_after IN ('inspired', 'satisfied', 'confused', 'enlightened', 'neutral')),
  environment TEXT CHECK (environment IN ('home', 'library', 'commute', 'cafe', 'outdoor', 'other')),
  device_type TEXT CHECK (device_type IN ('physical_book', 'ebook', 'audiobook', 'web')),
  notes_taken INTEGER DEFAULT 0,
  highlights_made INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for reading analytics
CREATE INDEX IF NOT EXISTS idx_reading_sessions_user ON reading_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_book ON reading_sessions(book_id);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_date ON reading_sessions(session_start);

-- =============================================================================
-- 7. USER_BOOK_ANALYTICS TABLE (Aggregated learning metrics)
-- =============================================================================

CREATE TABLE IF NOT EXISTS user_book_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES books_new(id) ON DELETE CASCADE NOT NULL,
  total_reading_time_minutes INTEGER DEFAULT 0,
  total_pages_read INTEGER DEFAULT 0,
  average_session_length_minutes DECIMAL DEFAULT 0,
  reading_consistency_score DECIMAL DEFAULT 0, -- 0-10 based on regular reading
  comprehension_trend DECIMAL DEFAULT 0, -- Trending up/down
  mindmaps_generated INTEGER DEFAULT 0,
  notes_count INTEGER DEFAULT 0,
  last_reading_session TIMESTAMP WITH TIME ZONE,
  estimated_completion_date DATE,
  learning_efficiency_score DECIMAL DEFAULT 0, -- Custom metric combining multiple factors
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  UNIQUE(user_id, book_id)
);

-- Indexes for analytics
CREATE INDEX IF NOT EXISTS idx_user_book_analytics_user ON user_book_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_book_analytics_efficiency ON user_book_analytics(learning_efficiency_score DESC);

-- =============================================================================
-- 8. TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =============================================================================

-- Updated trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
CREATE OR REPLACE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_books_updated_at 
  BEFORE UPDATE ON books_new 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_messages_updated_at 
  BEFORE UPDATE ON messages_new 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_notes_updated_at 
  BEFORE UPDATE ON notes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_mindmaps_updated_at 
  BEFORE UPDATE ON mindmaps 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_user_book_analytics_updated_at 
  BEFORE UPDATE ON user_book_analytics 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all user-data tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE books_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mindmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_analytics ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Books Policies
CREATE POLICY "Users can view own books" ON books_new
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own books" ON books_new
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own books" ON books_new
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own books" ON books_new
  FOR DELETE USING (auth.uid() = user_id);

-- Allow viewing public books (for future sharing features)
CREATE POLICY "Users can view public books" ON books_new
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM mindmaps 
      WHERE mindmaps.book_id = books_new.id 
      AND mindmaps.is_public = TRUE
    )
  );

-- Messages Policies
CREATE POLICY "Users can view own messages" ON messages_new
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages" ON messages_new
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own messages" ON messages_new
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages" ON messages_new
  FOR DELETE USING (auth.uid() = user_id);

-- Notes Policies
CREATE POLICY "Users can view own notes" ON notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes" ON notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes" ON notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes" ON notes
  FOR DELETE USING (auth.uid() = user_id);

-- Allow viewing public notes
CREATE POLICY "Users can view public notes" ON notes
  FOR SELECT USING (is_public = TRUE);

-- Mindmaps Policies
CREATE POLICY "Users can view own mindmaps" ON mindmaps
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mindmaps" ON mindmaps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mindmaps" ON mindmaps
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mindmaps" ON mindmaps
  FOR DELETE USING (auth.uid() = user_id);

-- Allow viewing public mindmaps and templates
CREATE POLICY "Users can view public mindmaps" ON mindmaps
  FOR SELECT USING (is_public = TRUE OR is_template = TRUE);

-- Reading Sessions Policies
CREATE POLICY "Users can view own reading sessions" ON reading_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reading sessions" ON reading_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reading sessions" ON reading_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Analytics Policies
CREATE POLICY "Users can view own analytics" ON user_book_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics" ON user_book_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analytics" ON user_book_analytics
  FOR UPDATE USING (auth.uid() = user_id);

-- =============================================================================
-- 10. ADDITIONAL FUNCTIONS FOR ANALYTICS AND AUTOMATION
-- =============================================================================

-- Function to automatically create user profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup (connects to auth.users)
-- This will be created when auth is implemented:
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update reading analytics
CREATE OR REPLACE FUNCTION update_reading_analytics()
RETURNS trigger AS $$
BEGIN
  -- Update or insert analytics record
  INSERT INTO user_book_analytics (user_id, book_id, total_reading_time_minutes, total_pages_read, last_reading_session)
  VALUES (
    NEW.user_id, 
    NEW.book_id, 
    COALESCE(NEW.time_spent_minutes, 0),
    COALESCE(NEW.pages_read, 0),
    NEW.session_start
  )
  ON CONFLICT (user_id, book_id) 
  DO UPDATE SET
    total_reading_time_minutes = user_book_analytics.total_reading_time_minutes + COALESCE(NEW.time_spent_minutes, 0),
    total_pages_read = user_book_analytics.total_pages_read + COALESCE(NEW.pages_read, 0),
    last_reading_session = NEW.session_start,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update analytics when reading session is created
CREATE OR REPLACE TRIGGER update_analytics_on_session
  AFTER INSERT ON reading_sessions
  FOR EACH ROW EXECUTE FUNCTION update_reading_analytics();

-- =============================================================================
-- 11. VIEWS FOR COMMON QUERIES
-- =============================================================================

-- View for user's book library with reading progress
CREATE OR REPLACE VIEW user_library AS
SELECT 
  b.*,
  COALESCE(a.total_reading_time_minutes, 0) as total_reading_time,
  COALESCE(a.total_pages_read, 0) as progress_pages,
  COALESCE(a.notes_count, 0) as notes_count,
  COALESCE(a.mindmaps_generated, 0) as mindmaps_count,
  a.last_reading_session,
  a.learning_efficiency_score
FROM books_new b
LEFT JOIN user_book_analytics a ON b.id = a.book_id AND b.user_id = a.user_id
WHERE b.user_id = auth.uid()
ORDER BY a.last_reading_session DESC NULLS LAST, b.created_at DESC;

-- View for recent activity feed
CREATE OR REPLACE VIEW user_recent_activity AS
SELECT 
  'reading_session' as activity_type,
  rs.id,
  rs.book_id,
  b.title as book_title,
  b.author as book_author,
  rs.session_start as activity_time,
  json_build_object(
    'pages_read', rs.pages_read,
    'time_spent', rs.time_spent_minutes,
    'session_end', rs.session_end
  ) as activity_data
FROM reading_sessions rs
JOIN books_new b ON rs.book_id = b.id
WHERE rs.user_id = auth.uid()

UNION ALL

SELECT 
  'mindmap_created' as activity_type,
  m.id,
  m.book_id,
  b.title as book_title,
  b.author as book_author,
  m.created_at as activity_time,
  json_build_object(
    'mindmap_type', m.mindmap_type,
    'title', m.title
  ) as activity_data
FROM mindmaps m
JOIN books_new b ON m.book_id = b.id
WHERE m.user_id = auth.uid()

UNION ALL

SELECT 
  'note_created' as activity_type,
  n.id,
  n.book_id,
  b.title as book_title,
  b.author as book_author,
  n.created_at as activity_time,
  json_build_object(
    'note_type', n.note_type,
    'title', n.title
  ) as activity_data
FROM notes n
JOIN books_new b ON n.book_id = b.id
WHERE n.user_id = auth.uid()

ORDER BY activity_time DESC
LIMIT 50;

-- =============================================================================
-- MIGRATION NOTES
-- =============================================================================

-- This schema is designed to:
-- 1. Support user authentication and data isolation
-- 2. Maintain backward compatibility where possible
-- 3. Enable advanced features like analytics, sharing, and collaboration
-- 4. Scale efficiently with proper indexing
-- 5. Ensure data security with RLS policies

-- When implementing:
-- 1. Run this schema on a new database or staging environment first
-- 2. Migrate existing data from old tables to new tables
-- 3. Update application code to use new table names and structures
-- 4. Test all functionality with authentication
-- 5. Deploy with zero downtime using blue-green deployment