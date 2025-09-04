import { z } from "zod";
import { userSchema } from "./userSchema.tsx";
import { zodResolver } from "@hookform/resolvers/zod";

const signUpRequestSchema =
    userSchema
    .pick({ email: true, firstname: true, lastname: true })
    .extend({
        password: z.string().min(6, "Legalább 6 karakter hosszúnak kell lennie a jelszónak").regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*?[#?!@$%^.&*-]).+$/,
            "A jelszónak legalább tartalmaznia kell egy kis- és nagybetűt, egy számot és egy speciális karaktert"
        ),
        rpassword: z.string()
    })
    .refine(data => data.password === data.rpassword, {
        message: "A két jelszó nem egyezik",
        path: ["rpassword"]
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

    return {
        defaultValues,
        resolver: zodResolver(signUpRequestSchema)
    };
};