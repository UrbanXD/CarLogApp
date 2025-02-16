import React from "npm:react@18.3.1";
import { render } from "npm:@react-email/components@0.0.22";
import { resend, EmailOTP, AuthEmailBody } from "../_shared/index.ts";

const handler = async (req: Request) => {
    if(req.method !== "POST") return new Response("Not Allowed", { status: 400 });

    try {
        const payload = await req.text();
        const {
            user: {
                email,
                new_email,
                confirmation_sent_at
            },
            email_data: {
                email_action_type,
                token
            }
        } = JSON.parse(payload) as AuthEmailBody;

        let subject: string = "Carlog App";
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
                subject = "Fiók hitelesítés!";
                break;
            case "email_change_current":
                subject = "Email cím módosítás";
                html = `<bold>${ token } uj: ${ new_email }</bold>`
                break;
            case "email_change_new":
                subject = "Email cím módosítás [uj]";
                html = `<bold>${ token } regi: ${ email }</bold>`;
                break;
            case "delete_verification":
                subject = "Törlés véglegesítés";
                html = await render(
                    React.createElement(EmailOTP, {
                        token,
                        title: "Fiók Törlés Véglegesítése",
                        content: "Az alábbi kód segítségével tudja fiókjának törlését véglegesíteni, de vigyázzon ez visszafordíthatatlan folyamat!",
                        footer: "Amennyiben nem Ön kezdeményezte a regisztrációt, nyugodtan figyelmen kivül hagyhatja ezt az üzenetet."
                    })
                );
                break;
            case "delete":
                subject = "Torles";
                html = "<bold>Felhasználó törölve</bold>";
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
            to: [email_action_type === "email_change_new" ? new_email : email],
            subject,
            html
        });

        if (error) return console.error({ error });

    } catch (error) {
        return new Response(JSON.stringify(error), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
         });
    }

    return new Response(
        JSON.stringify({}),
        {   status: 200,
            headers: {
                "Content-Type": "application/json"
            },
        }
    );
}

Deno.serve(handler);