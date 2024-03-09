import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://enpuyfxhpaelfcrutmcy.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucHV5ZnhocGFlbGZjcnV0bWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk1Njk0MTAsImV4cCI6MjAxNTE0NTQxMH0.vIUEBjfcfyGwS2wzKp-34mfCKbtrURKB2bSxU7RXgqc";

export default supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
