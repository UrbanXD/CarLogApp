import { z } from "zod";
import { signUpRequestSchema } from "./signUpRequest.ts";
import { zodResolver } from "@hookform/resolvers/zod";

const newPasswordRequest =
    signUpRequestSchema
    .pick({ password: true, rpassword: true })
    .refine(data => data.password === data.rpassword, {
        message: "A két jelszó nem egyezik",
        path: ["rpassword"]
    });
export type NewPasswordRequest = z.infer<typeof newPasswordRequest>;

export const useNewPasswordFormProps = () => ({
    defaultValues: { password: "", rpassword: "" } as NewPasswordRequest,
    resolver: zodResolver(newPasswordRequest)
});