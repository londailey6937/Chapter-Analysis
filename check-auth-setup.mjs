import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseClient = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkAuthSetup() {
  console.log("🔐 Checking Supabase Auth Configuration...\n");

  try {
    // Try to sign up a test user (this will fail if auth is not enabled)
    const { data, error } = await supabaseClient.auth.signUp({
      email: "test@example.com",
      password: "test123456",
    });

    if (error) {
      if (error.message.includes("Email signups are disabled")) {
        console.log("❌ Email authentication is NOT enabled");
        console.log("\n📝 To enable it:");
        console.log(
          "1. Go to: https://supabase.com/dashboard/project/ecazijmazbptvyfqmjho/auth/providers"
        );
        console.log('2. Find "Email" provider');
        console.log('3. Turn ON "Enable Email provider"');
        console.log("4. Click Save\n");
      } else if (error.message.includes("already registered")) {
        console.log("✅ Email authentication is ENABLED");
        console.log("   (Test user already exists - this is good!)\n");
      } else {
        console.log("⚠️  Error:", error.message);
      }
    } else {
      console.log("✅ Email authentication is ENABLED");
      console.log("   Test signup succeeded!\n");
    }
  } catch (err) {
    console.error("❌ Error checking auth:", err.message);
  }

  console.log("\n📊 Next steps:");
  console.log("1. Enable email auth in Supabase (if not enabled)");
  console.log("2. Open http://localhost:5174/");
  console.log('3. Click "Sign In" button');
  console.log("4. Create an account");
  console.log('5. Run analysis and click "Save Analysis"');
  console.log("\nSee ENABLE_AUTH.md for detailed instructions.");
}

checkAuthSetup().catch(console.error);
