import { GenerateLinkParams } from "npm:@supabase/auth-js/src/lib/types.ts";
import { AuthEmailBody, supabaseAdminClient } from "../_shared/index.ts";

const handler = async (req: Request) => {
  if(req.method !== "POST") return new Response("Not Allowed", { status: 400 });

  try {
    const payload = await req.text();
    const payloadObject = JSON.parse(payload) as GenerateLinkParams;
    const { data, error: generateLinkError } =
        await supabaseAdminClient
            .auth
            .admin
            .generateLink(payloadObject);

    if(generateLinkError) throw generateLinkError;

    const authEmailBody: AuthEmailBody = {
        user: {
            email: data.user.email,
            new_email: data.user.new_email,
            confirmation_sent_at: new Date().toISOString(),
        },
        email_data: {
            token: data.properties.email_otp,
            email_action_type:
                payloadObject.type === "magiclink"
                    ? "delete_verification"
                    : payloadObject.type
        }
    }

    const { error } =
        await supabaseAdminClient
            .functions
            .invoke(
                "auth-email",
                {
                    method: "POST",
                    body: JSON.stringify(authEmailBody)
                }
            );
    if(error) throw error;
  } catch (error) {
    console.log("error sajnos", error)
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
        headers: {
            "Content-Type": "application/json"
        },
      }
  );
}

Deno.serve(handler);