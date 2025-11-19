import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkActivity() {
  console.log('Checking database activity...\n');
  
  // Check profiles table
  const { data: profiles, error: profilesError, count: profileCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' });
  
  console.log('📊 Profiles table:');
  console.log(`   Records: ${profileCount || 0}`);
  if (profiles && profiles.length > 0) {
    console.log('   Data:', JSON.stringify(profiles, null, 2));
  } else {
    console.log('   Status: Empty (no user profiles created yet)');
  }
  
  console.log('\n📊 Saved Analyses table:');
  // Check saved_analyses table
  const { data: analyses, error: analysesError, count: analysisCount } = await supabase
    .from('saved_analyses')
    .select('*', { count: 'exact' });
  
  console.log(`   Records: ${analysisCount || 0}`);
  if (analyses && analyses.length > 0) {
    console.log('   Data:', JSON.stringify(analyses.map(a => ({
      id: a.id,
      user_id: a.user_id,
      chapter_title: a.chapter_title,
      created_at: a.created_at,
      overall_score: a.analysis_data?.overallScore
    })), null, 2));
  } else {
    console.log('   Status: Empty (no analyses saved yet)');
  }
  
  console.log('\n💡 What this means:');
  if ((profileCount || 0) === 0 && (analysisCount || 0) === 0) {
    console.log('   • The database is set up correctly but no data has been saved');
    console.log('   • Analysis runs locally without authentication');
    console.log('   • To save analyses, users need to sign up/login first');
    console.log('   • Authentication is optional - analysis works without it');
  } else if ((analysisCount || 0) > 0) {
    console.log('   • Analysis data has been saved to the database!');
    console.log(`   • ${analysisCount} analysis record(s) stored`);
  }
}

checkActivity().catch(console.error);
