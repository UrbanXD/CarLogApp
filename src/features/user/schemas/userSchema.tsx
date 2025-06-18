import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { zColor, zImage } from "../../../types/zodTypes.ts";

const userSchema = z
    .object({
        email: z.string().email("Nem megfelelő email cím formátum"),
        firstname: z.string().optional(),
        lastname: z.string().optional(),
        avatarImage: z.custom<zImage | zColor>().optional(),
    });

const signInFormSchema =
    userSchema
        .pick({ email: true })
        .extend({ password: z.string() });
export type SignInFormFieldType = z.infer<typeof signInFormSchema>;

const signUpFormSchema =
    userSchema
        .omit({ avatar: true })
        .extend({
            password: z.string().min(6, "Legalább 6 karakter hosszúnak kell lennie a jelszónak").regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*?[#?!@$%^.&*-]).+$/, "A jelszónak legalább tartalmaznia kell egy kis- és nagybetűt, egy számot és egy speciális karaktert"),
            rpassword: z.string(),
        })
        .refine(data => data.password === data.rpassword, {
            message: "A két jelszó nem egyezik",
            path: ["rpassword"]
        });
export type SignUpFormFieldType = z.infer<typeof signUpFormSchema>;

const editUserFormSchema = userSchema.partial();
export type EditUserFormFieldType = z.infer<typeof editUserFormSchema>;

export const useSignInFormProps = () => {
    return {
        defaultValues: {
            email: "",
            password: "",
        } as typeof signInFormSchema,
        resolver: zodResolver(signInFormSchema)
    }
}

export const useSignUpFormProps = () => {
    const defaultValues: SignUpFormFieldType = {
        email: "",
        firstname: "",
        lastname: "",
        password: "",
        rpassword: ""
    }

    return {
        defaultValues,
        resolver: zodResolver(signUpFormSchema)
    }
}

export const useEditUserFormProps = (user: EditUserFormFieldType) => {
    return {
        defaultValues: user,
        resolver: zodResolver(editUserFormSchema)
    }
}