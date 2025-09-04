import { z } from "zod";
import { userSchema } from "./userSchema.tsx";
import { zodResolver } from "@hookform/resolvers/zod";

const signInRequestSchema =
    userSchema
    .pick({ email: true })
    .extend({ password: z.string() });

export type SignInRequest = z.infer<typeof signInRequestSchema>;

export const useSignInFormProps = () => {
    const defaultValues: SignInRequest = {
        email: "",
        password: ""
    };

    return {
        defaultValues,
        resolver: zodResolver(signInRequest)
    };
};