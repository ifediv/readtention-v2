-- Optional Search Analytics Table for Readtention v2
-- This table tracks user book search patterns for recommendations and insights
-- Created: 2025-08-06

-- =============================================================================
-- SEARCH ANALYTICS TABLE (Optional Enhancement)
-- =============================================================================

CREATE TABLE IF NOT EXISTS search_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT, -- For anonymous tracking before auth
  search_query TEXT NOT NULL,
  search_type TEXT DEFAULT 'general' CHECK (search_type IN ('general', 'category', 'author', 'isbn')),
  category_filter TEXT, -- Which category was selected (if any)
  results_count INTEGER DEFAULT 0,
  books_selected TEXT[] DEFAULT '{}', -- Array of selected book IDs/titles
  books_added_to_library INTEGER DEFAULT 0,
  search_source TEXT DEFAULT 'web' CHECK (search_source IN ('web', 'mobile', 'api')),
  user_agent TEXT,
  ip_address INET, -- For geographic insights (anonymized)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_search_analytics_user ON search_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_search_analytics_query ON search_analytics USING GIN(to_tsvector('english', search_query));
CREATE INDEX IF NOT EXISTS idx_search_analytics_date ON search_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_search_analytics_type ON search_analytics(search_type);
CREATE INDEX IF NOT EXISTS idx_search_analytics_category ON search_analytics(category_filter);

-- Enable RLS for user data isolation
ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own search analytics" ON search_analytics
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own search analytics" ON search_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Service role can access all data for analytics
CREATE POLICY "Service role can access all search analytics" ON search_analytics
  FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- =============================================================================
-- ANALYTICS VIEWS FOR INSIGHTS
-- =============================================================================

-- Popular search terms view
CREATE OR REPLACE VIEW popular_searches AS
SELECT 
  search_query,
  search_type,
  category_filter,
  COUNT(*) as search_count,
  AVG(results_count) as avg_results,
  AVG(books_added_to_library) as avg_books_added,
  DATE_TRUNC('day', created_at) as search_date
FROM search_analytics
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY search_query, search_type, category_filter, DATE_TRUNC('day', created_at)
ORDER BY search_count DESC;

-- User search patterns view (for authenticated users)
CREATE OR REPLACE VIEW user_search_patterns AS
SELECT 
  user_id,
  COUNT(*) as total_searches,
  COUNT(DISTINCT search_query) as unique_queries,
  AVG(results_count) as avg_results_per_search,
  SUM(books_added_to_library) as total_books_discovered,
  ARRAY_AGG(DISTINCT category_filter) FILTER (WHERE category_filter IS NOT NULL) as preferred_categories,
  MAX(created_at) as last_search,
  MIN(created_at) as first_search
FROM search_analytics
WHERE user_id IS NOT NULL
GROUP BY user_id;

-- Category popularity view
CREATE OR REPLACE VIEW category_analytics AS
SELECT 
  category_filter,
  COUNT(*) as category_searches,
  AVG(books_added_to_library) as avg_conversion_rate,
  COUNT(DISTINCT user_id) as unique_users,
  DATE_TRUNC('week', created_at) as week_period
FROM search_analytics
WHERE category_filter IS NOT NULL
GROUP BY category_filter, DATE_TRUNC('week', created_at)
ORDER BY category_searches DESC;

-- =============================================================================
-- UTILITY FUNCTIONS
-- =============================================================================

-- Function to anonymize old search data (GDPR compliance)
CREATE OR REPLACE FUNCTION anonymize_old_search_data()
RETURNS void AS $$
BEGIN
  -- Anonymize searches older than 1 year for non-authenticated users
  UPDATE search_analytics 
  SET 
    search_query = 'anonymized',
    user_agent = NULL,
    ip_address = NULL
  WHERE 
    created_at < NOW() - INTERVAL '1 year'
    AND user_id IS NULL;
    
  -- Delete very old anonymous search data (older than 2 years)
  DELETE FROM search_analytics 
  WHERE 
    created_at < NOW() - INTERVAL '2 years'
    AND user_id IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to get search recommendations for a user
CREATE OR REPLACE FUNCTION get_search_recommendations(target_user_id UUID)
RETURNS TABLE(
  recommended_query TEXT,
  recommendation_reason TEXT,
  confidence_score DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH user_categories AS (
    SELECT category_filter, COUNT(*) as usage_count
    FROM search_analytics
    WHERE user_id = target_user_id AND category_filter IS NOT NULL
    GROUP BY category_filter
  ),
  similar_users AS (
    SELECT DISTINCT sa.user_id
    FROM search_analytics sa
    JOIN user_categories uc ON sa.category_filter = uc.category_filter
    WHERE sa.user_id != target_user_id AND sa.user_id IS NOT NULL
  ),
  popular_among_similar AS (
    SELECT 
      sa.search_query,
      COUNT(*) as popularity,
      AVG(sa.books_added_to_library) as conversion_rate
    FROM search_analytics sa
    JOIN similar_users su ON sa.user_id = su.user_id
    WHERE sa.search_query NOT IN (
      SELECT DISTINCT search_query 
      FROM search_analytics 
      WHERE user_id = target_user_id
    )
    GROUP BY sa.search_query
    HAVING COUNT(*) >= 2 AND AVG(sa.books_added_to_library) > 0
  )
  SELECT 
    pas.search_query::TEXT,
    'Popular among users with similar interests'::TEXT,
    LEAST(pas.popularity * pas.conversion_rate / 10.0, 1.0)::DECIMAL
  FROM popular_among_similar pas
  ORDER BY pas.popularity * pas.conversion_rate DESC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- MIGRATION NOTES
-- =============================================================================

-- This table is completely optional and can be added without affecting existing functionality
-- To implement:
-- 1. Run this SQL against your Supabase database
-- 2. Update the book search UI to log search events
-- 3. Use the analytics views for user insights and recommendations
-- 4. Set up a cron job to run anonymize_old_search_data() monthly

-- Example usage in application:
-- INSERT INTO search_analytics (user_id, search_query, search_type, category_filter, results_count, books_added_to_library) 
-- VALUES (auth.uid(), 'artificial intelligence', 'category', 'Technology', 24, 2);