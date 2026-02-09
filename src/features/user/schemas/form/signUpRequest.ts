import { z } from "zod";
import { userSchema } from "../userSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";

export const signUpRequestSchema =
    userSchema
    .pick({ email: true, firstname: true, lastname: true })
    .extend({
        password: z.string().min(6, "error.password_min_length;6").regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*?[#?!@$%^.&*-]).+$/,
            "error.password_format"
        ),
        rpassword: z.string()
    });

export type SignUpRequest = z.infer<typeof signUpRequestSchema>;

export const useSignUpFormProps = () => {
    const defaultValues: SignUpRequest = {
        email: "",
        firstname: "",
        lastname: "",
        password: "",
        rpassword: ""
    };

    const signUpSchema = signUpRequestSchema.refine(
        data => data.password === data.rpassword,
        {
            message: "error.passwords_not_equals",
            path: ["rpassword"]
        }
    );

    return { defaultValues, resolver: zodResolver(signUpSchema) };
};