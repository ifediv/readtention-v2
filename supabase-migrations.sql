-- Create mindmaps table for storing generated mind maps
CREATE TABLE IF NOT EXISTS mindmaps (
  id BIGSERIAL PRIMARY KEY,
  book_id BIGINT REFERENCES books(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster lookups by book_id
CREATE INDEX IF NOT EXISTS idx_mindmaps_book_id ON mindmaps(book_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mindmaps_updated_at BEFORE UPDATE ON mindmaps
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();