import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zgitzbtmwfrxrkododml.supabase.co";

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnaXR6YnRtd2ZyeHJrb2RvZG1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwOTg1NDQsImV4cCI6MjA5OTY3NDU0NH0.wsxgtObwNcyycuKEXpmmum3Wtk1V5-1OEoaEdzINrNc";

export const supabase = createClient(
    supabaseUrl,
    supabaseKey
);