import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log("\n🔍 Testing Supabase Connection...\n");
console.log("URL:", supabaseUrl);
console.log("Key (first 50 chars):", supabaseAnonKey?.substring(0, 50) + "...");
console.log("Key length:", supabaseAnonKey?.length);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log("\n📡 Testing basic connection...");

    // Test 1: Check if we can query (even if table doesn't exist, we should get a proper error)
    const { data, error } = await supabase
      .from("profiles")
      .select("count", { count: "exact", head: true });

    if (error) {
      console.error("❌ Error:", error.message);
      console.error("Details:", error);
    } else {
      console.log("✅ Connection successful!");
      console.log("Data:", data);
    }
  } catch (err) {
    console.error("❌ Exception:", err.message);
  }
}

testConnection();
