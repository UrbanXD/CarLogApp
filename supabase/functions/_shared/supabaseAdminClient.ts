import { createClient } from "npm:@supabase/supabase-js@2.41.0";

export const supabaseAdminClient = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    {
        global: {
            headers: { Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}` }
        }
    }
)