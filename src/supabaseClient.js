import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zgitzbtmwfrxrkododml.supabase.co";

const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

console.log("KEY EXISTS:", !!supabaseKey);

export const supabase = createClient(
    supabaseUrl,
    supabaseKey
);