import React from "npm:react@18.3.1";
import { render } from "npm:@react-email/components@0.0.22";
import { AuthEmailBody, Email, EmailOTP, resend } from "../_shared/index.ts";

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
                token,
                token_new
            }
        } = JSON.parse(payload) as AuthEmailBody;

        let emails: Array<Email> = [];

        switch(email_action_type) {
            case "signup":
                emails.push({
                    to: [email],
                    subject: "Fiók hitelesítés!",
                    html: await render(
                        React.createElement(EmailOTP, {
                            token,
                            title: "Fiók Hitelesítés",
                            content: "Az alábbi kód segítségével tudja fiókját hitelesíteni.",
                            footer: "Amennyiben nem Ön kezdeményezte a regisztrációt, nyugodtan figyelmen kivül hagyhatja ezt az üzenetet."
                        })
                    )
                });
                break;
            case "email_change":
                emails.push({
                    to: [email],
                    subject: "Email cím módosítási kérelem!",
                    html: await render(
                        React.createElement(EmailOTP, {
                            token,
                            title: "Email Cím Módosítási Kérelem Elfogadása",
                            content: `Az alábbi kód segítségével tudja fiókjának email címét módosítani. A kód felhasználása után, még az új email címét is hitelesíteni kell, az ehhez tartozó kód kiküldésre került a(z) ${ new_email } címre.`,
                            footer: "Amennyiben nem Ön kezdeményezte az email cím módosítását, nyugodtan figyelmen kivül hagyhatja ezt az üzenetet."
                        })
                    )
                });

                emails.push({
                    to: [new_email],
                    subject: "Új email cím hitelesítés!",
                    html: await render(
                        React.createElement(EmailOTP, {
                            token: token_new,
                            title: "Email Cím Hitelesítés",
                            content: "Az alábbi kód segítségével tudja fiókjának új email címét hitelesíteni.",
                            footer: "Amennyiben nem Ön kezdeményezte az email cím módosítását, nyugodtan figyelmen kivül hagyhatja ezt az üzenetet."
                        })
                    )
                });
                break;
            case "delete_verification":
                emails.push({
                    to: [email],
                    subject: "Fiók törlési kérelem!",
                    html: await render(
                        React.createElement(EmailOTP, {
                            token,
                            title: "Fiók Törlés Véglegesítése",
                            content: "Az alábbi kód segítségével tudja fiókjának törlését véglegesíteni, de vigyázzon ez visszafordíthatatlan folyamat!",
                            footer: "Amennyiben nem Ön kezdeményezte a fiók törlését, nyugodtan figyelmen kivül hagyhatja ezt az üzenetet."
                        })
                    )
                });
                break;
            case "delete":
                emails.push({
                    to: [email],
                    subject: "Torles",
                    html: "<bold>Felhasznalo torolvw</bold>"
                });
                break;
            default:
                emails.push({
                    to: [email],
                    subject: "Carlog App",
                    html: await render(
                        React.createElement(EmailOTP, {
                            token,
                            title: email_action_type,
                            content: "Az alábbi kód segítségével tudja elvégezni, hitelesíteni a kezdeményezett műveletet.",
                            footer: "Amennyiben nem Ön kezdeményezte a műveletet, nyugodtan figyelmen kivül hagyhatja ezt az üzenetet."
                        })
                    )
                });
        }

        for(let { to, subject, html } of emails) {
            const { error } = await resend.emails.send({
                from: "Carlog App <noreply@utictactoe.com>",
                to,
                subject,
                html
            });

            if(error) return console.error({ error });
        }
    } catch(error) {
        return new Response(JSON.stringify(error), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    return new Response(
        JSON.stringify({}),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
};

Deno.serve(handler);