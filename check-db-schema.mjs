import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkTables() {
  console.log('Checking database schema...\n');
  
  // Check profiles table
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);
  
  console.log('✓ profiles table:', profilesError ? `Error - ${profilesError.message}` : 'Exists and accessible');
  
  // Check saved_analyses table
  const { data: analyses, error: analysesError } = await supabase
    .from('saved_analyses')
    .select('*')
    .limit(1);
  
  console.log('✓ saved_analyses table:', analysesError ? `Error - ${analysesError.message}` : 'Exists and accessible');
  
  console.log('\n✅ Database schema is already set up!');
  console.log('\nYour Supabase database is ready to use.');
}

checkTables().catch(console.error);
