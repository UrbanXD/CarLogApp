import { Resend } from "npm:resend";

export const resend =
    new Resend(Deno.env.get("RESEND_API_KEY") as string);
