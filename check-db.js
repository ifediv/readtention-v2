#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://cchonlmfagkonsohrudq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjaG9ubG1mYWdrb25zb2hydWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNzc4NTAsImV4cCI6MjA2Mzg1Mzg1MH0.PDrrRySC6n40pbAMyEPlfbQN0SsMKwg--lXQLJ-8nuw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('🔍 Checking current database structure...\n');
  
  try {
    // Check books table
    console.log('📚 Checking books table...');
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('*')
      .limit(1);
    
    if (!booksError) {
      console.log('✅ Books table exists');
      if (books.length > 0) {
        console.log('📊 Sample book structure:', Object.keys(books[0]));
      }
    } else {
      console.log('❌ Books table error:', booksError.message);
    }
    
    // Check messages table  
    console.log('\n💬 Checking messages table...');
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .limit(1);
    
    if (!messagesError) {
      console.log('✅ Messages table exists');
      if (messages.length > 0) {
        console.log('📊 Sample message structure:', Object.keys(messages[0]));
      }
    } else {
      console.log('❌ Messages table error:', messagesError.message);
    }
    
    // Check notes table
    console.log('\n📝 Checking notes table...');
    const { data: notes, error: notesError } = await supabase
      .from('notes')
      .select('*')
      .limit(1);
    
    if (!notesError) {
      console.log('✅ Notes table exists');
      if (notes.length > 0) {
        console.log('📊 Sample note structure:', Object.keys(notes[0]));
      }
    } else {
      console.log('❌ Notes table missing:', notesError.message);
    }
    
    // Check mindmaps table
    console.log('\n🧠 Checking mindmaps table...');
    const { data: mindmaps, error: mindmapsError } = await supabase
      .from('mindmaps')
      .select('*')
      .limit(1);
    
    if (!mindmapsError) {
      console.log('✅ Mindmaps table exists');
      if (mindmaps.length > 0) {
        console.log('📊 Sample mindmap structure:', Object.keys(mindmaps[0]));
      }
    } else {
      console.log('❌ Mindmaps table missing:', mindmapsError.message);
    }
    
    console.log('\n🎯 Database check complete!');
    
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  }
}

checkDatabase();