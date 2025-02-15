import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormSchema } from "./userSchema.tsx";

export interface SignInFormFieldType {
    email: string
    password: string
}

const signInFormSchema =
    userFormSchema
        .pick({
            email: true,
        })
        .extend({
            password: z.string()
        });

export const useSignInFormProps = {
    defaultValues: {
        email: "",
        password: "",
    },
    resolver: zodResolver(signInFormSchema),
}