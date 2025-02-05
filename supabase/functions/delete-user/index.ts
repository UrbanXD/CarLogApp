import { createClient } from "npm:@supabase/supabase-js@2.41.0";

const supabaseAdminClient = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    {
      global: {
        headers: { Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}` }
      }
    }
)

interface Payload {
  id: string
}

const handler = async (req: Request) => {
  if(req.method !== "DELETE") return new Response("Not Allowed", { status: 400 });

  try {
    const payload = await req.text();
    const { id } = JSON.parse(payload) as Payload;

    const { error } = await supabaseAdminClient.auth.admin.deleteUser(id);
    if (error) throw error;

  } catch (error) {
    console.log("error sajnos")
    return new Response(
        JSON.stringify(error),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
    );
  }

  return new Response(
      JSON.stringify({}),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
  );
}

Deno.serve(handler);