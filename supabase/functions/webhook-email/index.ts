import { WebhookEmailBody, supabaseAdminClient, AuthEmailBody } from "../_shared/index.ts";

const handler = async (req: Request) => {
  if(req.method !== "POST") return new Response("Not Allowed", { status: 400 });

  try {
    const payload = await req.text();
    const {
      record,
      old_record
    } = JSON.parse(payload) as WebhookEmailBody;

    const authEmailBody: AuthEmailBody = {
      user: old_record,
      email_data: {
        email_action_type: "delete"
      }
    }

    const { error } =
        await supabaseAdminClient
            .functions
            .invoke(
                "auth-email",
                {
                    method: "POST",
                    body: JSON.stringify(authEmailBody),
                }
            )

    if(error) throw error;
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
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