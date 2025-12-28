import * as jose from "https://deno.land/x/jose@v4.3.8/index.ts";

const handler = async () => {
    const jwkJson = Deno.env.get("ES256_PRIVATE_JWK");
    const userId = Deno.env.get("POWERSYNC_QUEST_USER_ID");

    if(!jwkJson || !userId) {
        return new Response("Missing env vars", { status: 500 });
    }

    const jwk = JSON.parse(jwkJson);
    const privateKey = await jose.importJWK(jwk, "ES256");

    const now = Math.floor(Date.now() / 1000);

    const token = await new jose.SignJWT({
        iss: "supabase",
        sub: userId,
        role: "anon"
    })
    .setProtectedHeader({
        alg: "ES256",
        kid: jwk.kid,
        typ: "JWT"
    })
    .setIssuedAt(now)
    .setExpirationTime(now + 60 * 60 * 24)
    .sign(privateKey);

    return new Response(
        JSON.stringify({
            token,
            expires_at: now + 60 * 60 * 24,
            user_id: userId
        }),
        {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        }
    );
};

Deno.serve(handler);