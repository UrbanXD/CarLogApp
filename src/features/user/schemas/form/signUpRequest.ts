import { z } from "zod";
import { userSchema } from "../userSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";

export const signUpRequestSchema =
    userSchema
    .pick({ email: true, firstname: true, lastname: true })
    .extend({
        password: z.string().min(6, "Legalább 6 karakter hosszúnak kell lennie a jelszónak").regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*?[#?!@$%^.&*-]).+$/,
            "A jelszónak legalább tartalmaznia kell egy kis- és nagybetűt, egy számot és egy speciális karaktert"
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
            message: "A két jelszó nem egyezik",
            path: ["rpassword"]
        }
    );

    return { defaultValues, resolver: zodResolver(signUpSchema) };
};