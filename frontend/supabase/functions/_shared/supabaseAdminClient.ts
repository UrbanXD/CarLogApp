import { createClient, SupabaseClient } from "npm:@supabase/supabase-js@2.41.0";
import { Database } from "./types/database.types.ts";

export const supabaseAdminClient: SupabaseClient<Database> = createClient<Database>(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    {
        global: {
            headers: { Authorization: `Bearer ${ Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") }` }
        }
    }
);