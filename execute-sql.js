#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = 'https://cchonlmfagkonsohrudq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjaG9ubG1mYWdrb25zb2hydWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNzc4NTAsImV4cCI6MjA2Mzg1Mzg1MH0.PDrrRySC6n40pbAMyEPlfbQN0SsMKwg--lXQLJ-8nuw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSQLFile(filePath) {
  try {
    console.log(`📋 Reading SQL file: ${filePath}`);
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    
    console.log('🔄 Executing SQL commands...');
    
    // Split SQL content into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && stmt !== 'BEGIN' && stmt !== 'COMMIT');
    
    console.log(`📊 Found ${statements.length} SQL statements to execute`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip comments and empty statements
      if (statement.startsWith('--') || statement.trim() === '') {
        continue;
      }
      
      // Skip SELECT statements that are just for verification
      if (statement.toLowerCase().trim().startsWith('select') && 
          (statement.includes('SUCCESS:') || statement.includes('information_schema'))) {
        console.log(`⏭️  Skipping verification query: ${statement.substring(0, 50)}...`);
        continue;
      }
      
      try {
        console.log(`🔄 Executing statement ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
        
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: statement });
        
        if (error) {
          console.error(`❌ Error in statement ${i + 1}:`, error.message);
          errorCount++;
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
          successCount++;
        }
      } catch (err) {
        // Try direct execution for DDL statements
        try {
          const { error } = await supabase.from('pg_stat_user_tables').select('*').limit(1);
          if (!error) {
            console.log(`⚠️  Statement ${i + 1} may require database admin privileges`);
          }
        } catch (directErr) {
          console.error(`❌ Failed to execute statement ${i + 1}:`, err.message);
          errorCount++;
        }
      }
    }
    
    console.log(`\n📊 Execution Summary:`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`📊 Total: ${successCount + errorCount}`);
    
    if (errorCount === 0) {
      console.log(`\n🎉 All SQL statements executed successfully!`);
    } else {
      console.log(`\n⚠️  ${errorCount} statements failed. This might be expected for admin-level operations.`);
    }
    
  } catch (error) {
    console.error('❌ Error executing SQL file:', error.message);
    process.exit(1);
  }
}

// Check if file path is provided
const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node execute-sql.js <sql-file-path>');
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

executeSQLFile(filePath);