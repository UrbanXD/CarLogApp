import { Resend } from "npm:resend";
const resend = new Resend(Deno.env.get("RESEND_API_KEY") as string);
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

type UserRecord = {
  email: string
  created_at: string
}

interface WebhookResult {
  record: UserRecord | null
  old_record: UserRecord | null
}

const handler = async (req: Request) => {
  if(req.method !== "POST") return new Response("Not Allowed", { status: 400 });

  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);
  console.log("Received Payload:", payload);
  console.log("Received Headers:", headers);
  try {
    const { record, old_record } = JSON.parse(payload) as WebhookResult;
    let html: string;

    html = "<bold>Torolve</bold>"
    // html = await render(
    //     React.createElement(EmailOTP, {
    //       token: email_data.token,
    //       title: "Fiók Hitelesítés",
    //       content: "Az alábbi kód segítségével tudja fiókját hitelesíteni.",
    //       footer: "Amennyiben nem Ön kezdeményezte a regisztrációt, nyugodtan figyelmen kivül hagyhatja ezt az üzenetet."
    //     })
    // );

    const { error } = await resend.emails.send({
      from: "Carlog App <noreply@rankedarena.net>",
      to: [old_record.email],
      subject: "Fiók Torles!",
      html: html
    });

    if (error) {
      return console.error({ error });
    }

  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const responseHeaders = new Headers()
  responseHeaders.set('Content-Type', 'application/json')
  return new Response(JSON.stringify({}), {
    status: 200,
    headers: responseHeaders,
  })
}

Deno.serve(handler);