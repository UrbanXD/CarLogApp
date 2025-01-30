import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

export interface SignInFormFieldType {
    email: string
    password: string
}

export const signInFormSchema = z
    .object({
        email: z.string().email("Nem megfelelő email cím formátum"),
        password: z.string(),
    });

export const useSignInFormProps = {
    defaultValues: {
        email: "",
        password: "",
    },
    resolver: zodResolver(signInFormSchema),
}