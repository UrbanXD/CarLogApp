import { Resend } from "npm:resend";
import EmailOTP from "./templates/EmailOTP.tsx";
import React from 'npm:react@18.3.1';
import { render } from 'npm:@react-email/components@0.0.22';

const resend = new Resend(Deno.env.get("RESEND_API_KEY") as string);

interface WebhookResult {
  user: {
    email: string,
    confirmation_sent_at: string
  },
  email_data: {
    token: string
    email_action_type: string
  }
}

const handler = async (req: Request) => {
  if(req.method !== "POST") return new Response("Not Allowed", { status: 400 });

  const payload = await req.text();

  try {
    const {
      user: { email, confirmation_sent_at },
      email_data: { email_action_type, token }
    } = JSON.parse(payload) as WebhookResult;
    let html: string;

    console.log(email_action_type, confirmation_sent_at)

    switch (email_action_type) {
      case "signup":
        html = await render(
            React.createElement(EmailOTP, {
              token,
              title: "Fiók Hitelesítés",
              content: "Az alábbi kód segítségével tudja fiókját hitelesíteni.",
              footer: "Amennyiben nem Ön kezdeményezte a regisztrációt, nyugodtan figyelmen kivül hagyhatja ezt az üzenetet."
            })
        );
        break;
      default:
        html = await render(
            React.createElement(EmailOTP, {
              token,
              title: email_action_type,
              content: "Az alábbi kód segítségével tudja fiókját hitelesíteni.",
              footer: "Amennyiben nem Ön kezdeményezte a regisztrációt, nyugodtan figyelmen kivül hagyhatja ezt az üzenetet."
            })
        );
    }

    const { error } = await resend.emails.send({
      from: "Carlog App <noreply@rankedarena.net>",
      to: [email],
      subject: "Fiók hitelesítés!",
      html: html
    });

    if (error) return console.error({ error });

  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const responseHeaders = new Headers();
  responseHeaders.set('Content-Type', 'application/json');
  return new Response(JSON.stringify({}), {
    status: 200,
    headers: responseHeaders,
  })
}

Deno.serve(handler);