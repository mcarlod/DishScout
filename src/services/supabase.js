import { createClient } from "@supabase/supabase-js";

// Vite exposes variables prefixed with VITE_ from .env.local via import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error(
        "Missing Supabase config. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local"
    );
}

// One shared client for the whole app
export const supabase = createClient(supabaseUrl, supabaseKey);
