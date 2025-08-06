#!/usr/bin/env node

/**
 * Database Setup Script for Readtention v2
 * Creates missing notes and mindmaps tables in Supabase
 * Run this once to initialize the required database schema
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://cchonlmfagkonsohrudq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjaG9ubG1mYWdrb25zb2hydWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNzc4NTAsImV4cCI6MjA2Mzg1Mzg1MH0.PDrrRySC6n40pbAMyEPlfbQN0SsMKwg--lXQLJ-8nuw';

const supabase = createClient(supabaseUrl, supabaseKey);

const SQL_COMMANDS = [
  // Create notes table
  `CREATE TABLE IF NOT EXISTS notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    book_id UUID,
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
  )`,
  
  // Create mindmaps table
  `CREATE TABLE IF NOT EXISTS mindmaps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    book_id UUID,
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
  )`,
  
  // Create indexes
  `CREATE INDEX IF NOT EXISTS idx_notes_book_id ON notes(book_id)`,
  `CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id) WHERE user_id IS NOT NULL`,
  `CREATE INDEX IF NOT EXISTS idx_mindmaps_book_id ON mindmaps(book_id)`,
  `CREATE INDEX IF NOT EXISTS idx_mindmaps_user_id ON mindmaps(user_id) WHERE user_id IS NOT NULL`,
];

async function setupDatabase() {
  console.log('🚀 Setting up Readtention v2 database schema...\n');
  
  try {
    // Note: These commands require database admin privileges
    // If this fails, the SQL needs to be executed directly in Supabase Dashboard
    console.log('⚠️  Note: This requires database admin privileges.');
    console.log('📋 If this fails, please execute the SQL in Supabase Dashboard at:');
    console.log('🔗 https://supabase.com/dashboard/project/cchonlmfagkonsohrudq/sql\n');
    
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < SQL_COMMANDS.length; i++) {
      const command = SQL_COMMANDS[i];
      const commandName = command.split(' ')[0] + ' ' + (command.split(' ')[4] || command.split(' ')[3] || '');
      
      console.log(`🔄 Executing: ${commandName}...`);
      
      try {
        // Try to execute via RPC (requires a custom function in Supabase)
        const { data, error } = await supabase.rpc('exec_sql', { query: command });
        
        if (error) {
          console.log(`❌ Failed: ${error.message}`);
          failCount++;
        } else {
          console.log(`✅ Success: ${commandName}`);
          successCount++;
        }
      } catch (err) {
        console.log(`❌ Failed: ${err.message}`);
        failCount++;
      }
    }
    
    console.log(`\n📊 Setup Summary:`);
    console.log(`✅ Successful commands: ${successCount}`);
    console.log(`❌ Failed commands: ${failCount}`);
    
    if (failCount > 0) {
      console.log(`\n🛠️  Manual Setup Required:`);
      console.log(`Please copy and paste the following SQL into Supabase Dashboard:`);
      console.log(`🔗 https://supabase.com/dashboard/project/cchonlmfagkonsohrudq/sql\n`);
      console.log(`--- COPY FROM HERE ---`);
      SQL_COMMANDS.forEach(cmd => console.log(cmd + ';'));
      console.log(`--- COPY TO HERE ---\n`);
    }
    
    // Test if tables exist now
    console.log('🧪 Testing table creation...');
    await testTables();
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log(`\n🛠️  Manual Setup Required:`);
    console.log(`Please execute the SQL commands in create-missing-tables.sql`);
    console.log(`in the Supabase Dashboard SQL Editor.`);
  }
}

async function testTables() {
  try {
    // Test notes table
    const { data: notes, error: notesError } = await supabase
      .from('notes')
      .select('id')
      .limit(1);
    
    if (!notesError) {
      console.log('✅ Notes table is accessible');
    } else {
      console.log('❌ Notes table not accessible:', notesError.message);
    }
    
    // Test mindmaps table
    const { data: mindmaps, error: mindmapsError } = await supabase
      .from('mindmaps')
      .select('id')
      .limit(1);
    
    if (!mindmapsError) {
      console.log('✅ Mindmaps table is accessible');
    } else {
      console.log('❌ Mindmaps table not accessible:', mindmapsError.message);
    }
    
    if (!notesError && !mindmapsError) {
      console.log('\n🎉 Database setup complete! Your application is ready to use.');
    }
    
  } catch (error) {
    console.log('❌ Table test failed:', error.message);
  }
}

// Run setup
setupDatabase();