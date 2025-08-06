-- Readtention v2 - Create Missing Tables (notes and mindmaps)
-- Execute this in Supabase SQL Editor: https://supabase.com/dashboard/project/cchonlmfagkonsohrudq/sql
-- Date: 2025-08-05

-- =============================================================================
-- 1. CREATE NOTES TABLE
-- =============================================================================

CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- Will be populated when auth is implemented
  book_id UUID, -- References books.id
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

-- =============================================================================
-- 2. CREATE MINDMAPS TABLE
-- =============================================================================

CREATE TABLE mindmaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- Will be populated when auth is implemented
  book_id UUID, -- References books.id
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
-- 3. CREATE INDEXES FOR PERFORMANCE
-- =============================================================================

-- Notes indexes
CREATE INDEX idx_notes_book_id ON notes(book_id);
CREATE INDEX idx_notes_user_id ON notes(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_notes_tags ON notes USING GIN(tags);
CREATE INDEX idx_notes_type ON notes(note_type);
CREATE INDEX idx_notes_created_at ON notes(created_at);

-- Mindmaps indexes
CREATE INDEX idx_mindmaps_book_id ON mindmaps(book_id);
CREATE INDEX idx_mindmaps_user_id ON mindmaps(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_mindmaps_note_id ON mindmaps(note_id) WHERE note_id IS NOT NULL;
CREATE INDEX idx_mindmaps_type ON mindmaps(mindmap_type);
CREATE INDEX idx_mindmaps_created_at ON mindmaps(created_at);
CREATE INDEX idx_mindmaps_public ON mindmaps(is_public) WHERE is_public = TRUE;

-- =============================================================================
-- 4. CREATE UPDATED_AT TRIGGER FUNCTION
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- =============================================================================
-- 5. ADD TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- =============================================================================

CREATE TRIGGER update_notes_updated_at 
  BEFORE UPDATE ON notes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mindmaps_updated_at 
  BEFORE UPDATE ON mindmaps 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 6. ADD MISSING COLUMNS TO EXISTING TABLES
-- =============================================================================

-- Add missing columns to books table
ALTER TABLE books ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;
ALTER TABLE books ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;
ALTER TABLE books ADD COLUMN IF NOT EXISTS cover_url TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS reading_status TEXT DEFAULT 'want_to_read' 
  CHECK (reading_status IN ('want_to_read', 'reading', 'completed', 'paused'));
ALTER TABLE books ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE;

-- Add trigger for books table
CREATE OR REPLACE TRIGGER update_books_updated_at 
  BEFORE UPDATE ON books 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add missing columns to messages table  
ALTER TABLE messages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS conversation_stage TEXT DEFAULT 'general' 
  CHECK (conversation_stage IN ('welcome', 'central', 'branches', 'subbranches', 'refinement', 'general'));
ALTER TABLE messages ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Add trigger for messages table
CREATE OR REPLACE TRIGGER update_messages_updated_at 
  BEFORE UPDATE ON messages 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 7. CREATE PERFORMANCE INDEXES ON EXISTING TABLES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_books_user_id ON books(user_id);
CREATE INDEX IF NOT EXISTS idx_books_reading_status ON books(reading_status);
CREATE INDEX IF NOT EXISTS idx_books_favorite ON books(user_id, is_favorite) WHERE is_favorite = TRUE;
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_stage ON messages(book_id, conversation_stage);

-- =============================================================================
-- SUCCESS MESSAGE
-- =============================================================================

SELECT 'SUCCESS: Notes and mindmaps tables created with full functionality!' as result;