import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const SIGN_UP_STEPS_FIELD = [
    ["email"],
    ["firstname", "lastname"],
    ["password", "rpassword"]
];
export const SIGN_UP_STEPS_TITLE = [
    "",
    "Személyes adatok",
    "Jelszó"
];

export interface SignUpFormFieldType {
    email: string
    firstname: string
    lastname: string
    password: string
    rpassword: string
}

export const signUpFormSchema = z
    .object({
        email: z.string().email("Nem megfelelő email cím formátum"),
        firstname: z.string().min(2, "Nem elég hosszú a név"),
        lastname: z.string().min(2, "Nem elég hosszú a név"),
        password: z.string().min(6, "Legalább 6 karakter hosszúnak kell lennie a jelszónak").regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*?[#?!@$%^.&*-]).+$/, "A jelszónak legalább tartalmaznia kell egy kis- és nagybetűt, egy számot és egy speciális karaktert"),
        rpassword: z.string()
    })
    .refine(data => data.password === data.rpassword, {
        message: "A két jelszó nem egyezik",
        path: ["rpassword"]
    })

export const useSignUpFormProps =  {
    defaultValues: {
        email: "",
        firstname: "",
        lastname: "",
        password: "",
        rpassword: ""
    },
    resolver: zodResolver(signUpFormSchema),
}