-- Readtention v2 - Immediate Implementation Script
-- Creates missing tables that can be implemented right now without breaking existing functionality
-- Date: 2025-01-05

-- =============================================================================
-- 1. CREATE MISSING TABLES (notes and mindmaps)
-- =============================================================================

-- Notes table - for structured note-taking
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- Will be populated when auth is implemented
  book_id UUID, -- References books.id (currently UUID type)
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
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Mindmaps table - for AI-generated and user mind maps
CREATE TABLE IF NOT EXISTS mindmaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- Will be populated when auth is implemented
  book_id UUID, -- References books.id (currently UUID type)
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

-- =============================================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- =============================================================================

-- Notes indexes
CREATE INDEX IF NOT EXISTS idx_notes_book_id ON notes(book_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notes_tags ON notes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_notes_type ON notes(note_type);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);
CREATE INDEX IF NOT EXISTS idx_notes_search ON notes USING GIN(to_tsvector('english', 
  COALESCE(title, '') || ' ' || 
  COALESCE(themes, '') || ' ' || 
  COALESCE(takeaways, '') || ' ' ||
  COALESCE(key_insights, '')
));

-- Mindmaps indexes
CREATE INDEX IF NOT EXISTS idx_mindmaps_book_id ON mindmaps(book_id);
CREATE INDEX IF NOT EXISTS idx_mindmaps_user_id ON mindmaps(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_mindmaps_note_id ON mindmaps(note_id) WHERE note_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_mindmaps_type ON mindmaps(mindmap_type);
CREATE INDEX IF NOT EXISTS idx_mindmaps_created_at ON mindmaps(created_at);
CREATE INDEX IF NOT EXISTS idx_mindmaps_public ON mindmaps(is_public) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_mindmaps_template ON mindmaps(is_template) WHERE is_template = TRUE;

-- =============================================================================
-- 3. UPDATE EXISTING TRIGGER FUNCTION AND ADD TO NEW TABLES
-- =============================================================================

-- Ensure the updated_at trigger function exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for new tables
CREATE OR REPLACE TRIGGER update_notes_updated_at 
  BEFORE UPDATE ON notes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_mindmaps_updated_at 
  BEFORE UPDATE ON mindmaps 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 4. ENHANCE EXISTING TABLES WITH MISSING COLUMNS
-- =============================================================================

-- Add missing columns to books table (if they don't exist)
DO $$ 
BEGIN
  -- Add user_id if it doesn't exist (it already exists based on our analysis)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='books' AND column_name='user_id') THEN
    ALTER TABLE books ADD COLUMN user_id UUID;
    CREATE INDEX IF NOT EXISTS idx_books_user_id ON books(user_id);
  END IF;
  
  -- Add created_at if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='books' AND column_name='created_at') THEN
    ALTER TABLE books ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;
  END IF;
  
  -- Add updated_at if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='books' AND column_name='updated_at') THEN
    ALTER TABLE books ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;
    -- Add trigger for books table
    CREATE OR REPLACE TRIGGER update_books_updated_at 
      BEFORE UPDATE ON books 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  -- Add enhanced metadata columns for future features
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='books' AND column_name='cover_url') THEN
    ALTER TABLE books ADD COLUMN cover_url TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='books' AND column_name='reading_status') THEN
    ALTER TABLE books ADD COLUMN reading_status TEXT DEFAULT 'want_to_read' 
      CHECK (reading_status IN ('want_to_read', 'reading', 'completed', 'paused'));
    CREATE INDEX IF NOT EXISTS idx_books_reading_status ON books(reading_status);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='books' AND column_name='is_favorite') THEN
    ALTER TABLE books ADD COLUMN is_favorite BOOLEAN DEFAULT FALSE;
    CREATE INDEX IF NOT EXISTS idx_books_favorite ON books(user_id, is_favorite) WHERE is_favorite = TRUE;
  END IF;
END $$;

-- Enhance messages table with missing columns
DO $$ 
BEGIN
  -- Add user_id if it doesn't exist (it already exists based on our analysis)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='user_id') THEN
    ALTER TABLE messages ADD COLUMN user_id UUID;
    CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
  END IF;
  
  -- Add updated_at if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='updated_at') THEN
    ALTER TABLE messages ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;
    -- Add trigger for messages table
    CREATE OR REPLACE TRIGGER update_messages_updated_at 
      BEFORE UPDATE ON messages 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  -- Add conversation_stage for better chat flow management
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='conversation_stage') THEN
    ALTER TABLE messages ADD COLUMN conversation_stage TEXT DEFAULT 'general' 
      CHECK (conversation_stage IN ('welcome', 'central', 'branches', 'subbranches', 'refinement', 'general'));
    CREATE INDEX IF NOT EXISTS idx_messages_conversation_stage ON messages(book_id, conversation_stage);
  END IF;
  
  -- Add metadata for storing AI model info, tokens used, etc.
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='metadata') THEN
    ALTER TABLE messages ADD COLUMN metadata JSONB DEFAULT '{}';
  END IF;
END $$;

-- =============================================================================
-- 5. CREATE VIEWS FOR COMMON QUERIES
-- =============================================================================

-- View for user's complete book information with statistics
CREATE OR REPLACE VIEW book_summary AS
SELECT 
  b.*,
  COUNT(DISTINCT n.id) as notes_count,
  COUNT(DISTINCT m.id) as mindmaps_count,
  COUNT(DISTINCT msg.id) as messages_count,
  MAX(msg.created_at) as last_activity,
  COUNT(DISTINCT m.id) FILTER (WHERE m.mindmap_type = 'ai_generated') as ai_mindmaps_count,
  COUNT(DISTINCT m.id) FILTER (WHERE m.mindmap_type = 'user_created') as user_mindmaps_count
FROM books b
LEFT JOIN notes n ON b.id = n.book_id
LEFT JOIN mindmaps m ON b.id = m.book_id  
LEFT JOIN messages msg ON b.id::TEXT = msg.book_id
GROUP BY b.id, b.user_id, b.title, b.author, b.cover_url, b.reading_status, b.is_favorite, b.created_at, b.updated_at;

-- View for recent user activity (works without auth for now)
CREATE OR REPLACE VIEW recent_activity AS
SELECT 
  'note_created' as activity_type,
  n.id as item_id,
  n.book_id,
  b.title as book_title,
  b.author as book_author,
  n.created_at as activity_time,
  json_build_object(
    'note_type', n.note_type,
    'title', n.title,
    'has_themes', (n.themes IS NOT NULL AND n.themes != ''),
    'has_quotes', (n.quotes IS NOT NULL AND n.quotes != ''),
    'has_takeaways', (n.takeaways IS NOT NULL AND n.takeaways != '')
  ) as activity_data,
  n.user_id
FROM notes n
JOIN books b ON n.book_id = b.id

UNION ALL

SELECT 
  'mindmap_created' as activity_type,
  m.id as item_id,
  m.book_id,
  b.title as book_title,
  b.author as book_author,
  m.created_at as activity_time,
  json_build_object(
    'mindmap_type', m.mindmap_type,
    'title', m.title,
    'ai_model', m.ai_model
  ) as activity_data,
  m.user_id
FROM mindmaps m
JOIN books b ON m.book_id = b.id

UNION ALL

SELECT 
  'book_added' as activity_type,
  b.id as item_id,
  b.id as book_id,
  b.title as book_title,
  b.author as book_author,
  b.created_at as activity_time,
  json_build_object(
    'reading_status', b.reading_status,
    'is_favorite', b.is_favorite
  ) as activity_data,
  b.user_id
FROM books b

ORDER BY activity_time DESC
LIMIT 100;

-- =============================================================================
-- 6. UTILITY FUNCTIONS
-- =============================================================================

-- Function to create a note and automatically generate mindmap
CREATE OR REPLACE FUNCTION create_note_with_mindmap(
  p_book_id UUID,
  p_user_id UUID DEFAULT NULL,
  p_title TEXT DEFAULT NULL,
  p_themes TEXT DEFAULT NULL,
  p_quotes TEXT DEFAULT NULL,
  p_takeaways TEXT DEFAULT NULL,
  p_auto_generate_mindmap BOOLEAN DEFAULT TRUE
)
RETURNS UUID AS $$
DECLARE
  note_id UUID;
  mindmap_content TEXT;
BEGIN
  -- Insert the note
  INSERT INTO notes (
    book_id, user_id, title, themes, quotes, takeaways
  ) VALUES (
    p_book_id, p_user_id, p_title, p_themes, p_quotes, p_takeaways
  ) RETURNING id INTO note_id;
  
  -- Optionally generate mindmap content
  IF p_auto_generate_mindmap AND (p_themes IS NOT NULL OR p_takeaways IS NOT NULL) THEN
    -- Create basic mindmap structure from notes
    mindmap_content := '# ' || COALESCE(p_title, 'Book Notes') || E'\n\n';
    
    IF p_themes IS NOT NULL AND p_themes != '' THEN
      mindmap_content := mindmap_content || '## Main Themes' || E'\n';
      mindmap_content := mindmap_content || '- ' || replace(p_themes, E'\n', E'\n- ') || E'\n\n';
    END IF;
    
    IF p_quotes IS NOT NULL AND p_quotes != '' THEN
      mindmap_content := mindmap_content || '## Key Quotes' || E'\n';
      mindmap_content := mindmap_content || '- ' || replace(p_quotes, E'\n', E'\n- ') || E'\n\n';
    END IF;
    
    IF p_takeaways IS NOT NULL AND p_takeaways != '' THEN
      mindmap_content := mindmap_content || '## Key Takeaways' || E'\n';
      mindmap_content := mindmap_content || '- ' || replace(p_takeaways, E'\n', E'\n- ') || E'\n\n';
    END IF;
    
    -- Insert the mindmap
    INSERT INTO mindmaps (
      book_id, user_id, note_id, title, content, mindmap_type
    ) VALUES (
      p_book_id, p_user_id, note_id, 
      COALESCE(p_title, 'Generated Mind Map'), 
      mindmap_content, 
      'user_created'
    );
  END IF;
  
  RETURN note_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get book statistics
CREATE OR REPLACE FUNCTION get_book_stats(book_uuid UUID)
RETURNS TABLE(
  total_notes INTEGER,
  total_mindmaps INTEGER,
  total_messages INTEGER,
  last_activity TIMESTAMP WITH TIME ZONE,
  reading_progress TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT n.id)::INTEGER as total_notes,
    COUNT(DISTINCT m.id)::INTEGER as total_mindmaps,
    COUNT(DISTINCT msg.id)::INTEGER as total_messages,
    MAX(GREATEST(
      COALESCE(n.created_at, '1970-01-01'::TIMESTAMP WITH TIME ZONE),
      COALESCE(m.created_at, '1970-01-01'::TIMESTAMP WITH TIME ZONE),
      COALESCE(msg.created_at, '1970-01-01'::TIMESTAMP WITH TIME ZONE)
    )) as last_activity,
    CASE 
      WHEN COUNT(DISTINCT m.id) > 0 AND COUNT(DISTINCT n.id) > 0 THEN 'Advanced'
      WHEN COUNT(DISTINCT m.id) > 0 THEN 'Mind Mapped'
      WHEN COUNT(DISTINCT n.id) > 0 THEN 'Notes Taken'
      WHEN COUNT(DISTINCT msg.id) > 0 THEN 'Started'
      ELSE 'Just Added'
    END as reading_progress
  FROM books b
  LEFT JOIN notes n ON b.id = n.book_id
  LEFT JOIN mindmaps m ON b.id = m.book_id
  LEFT JOIN messages msg ON b.id::TEXT = msg.book_id
  WHERE b.id = book_uuid
  GROUP BY b.id;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 7. SAMPLE DATA FOR TESTING (Optional)
-- =============================================================================

-- Uncomment these lines to insert sample data for testing:

-- INSERT INTO notes (book_id, title, themes, quotes, takeaways) 
-- SELECT 
--   id as book_id,
--   'Sample Notes for ' || title as title,
--   'Leadership, Innovation, Strategy' as themes,
--   'The only way to do great work is to love what you do.' as quotes,
--   'Focus on user experience and continuous improvement' as takeaways
-- FROM books 
-- LIMIT 1
-- ON CONFLICT DO NOTHING;

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Run these queries to verify the implementation:

-- Check if tables were created successfully
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('notes', 'mindmaps');

-- Check indexes were created
-- SELECT indexname FROM pg_indexes WHERE tablename IN ('notes', 'mindmaps');

-- Check triggers were created
-- SELECT trigger_name, event_manipulation, event_object_table FROM information_schema.triggers WHERE event_object_table IN ('notes', 'mindmaps');

-- Verify the views work
-- SELECT * FROM book_summary LIMIT 5;
-- SELECT * FROM recent_activity LIMIT 10;

-- Test the utility function
-- SELECT get_book_stats((SELECT id FROM books LIMIT 1));

-- =============================================================================
-- SUCCESS MESSAGE
-- =============================================================================

-- If this script runs without errors, you should see:
SELECT 'SUCCESS: Immediate implementation completed. Notes and mindmaps tables created with proper indexes, triggers, and utility functions.' as status;