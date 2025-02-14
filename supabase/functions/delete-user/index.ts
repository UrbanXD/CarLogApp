import { supabaseAdminClient } from "../_shared/index.ts";

interface Payload {
  id: string
}

const handler = async (req: Request) => {
  if(req.method !== "DELETE") return new Response("Not Allowed", { status: 400 });

  try {
    const payload = await req.text();
    const { id } =
        JSON.parse(payload) as Payload;

    const { error } =
        await supabaseAdminClient
            .auth
            .admin
            .deleteUser(id);

    if (error) throw error;
  } catch (error) {
    return new Response(
        JSON.stringify(error),
        {
          status: 500,
          headers: {
              "Content-Type": "application/json"
          },
        }
    );
  }

  return new Response(
      JSON.stringify({}),
      {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        },
      }
  );
}

Deno.serve(handler);