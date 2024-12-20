import { z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "react-native";
import { GetFormHandleSubmitArgs } from "../../../core/constants/constants";
import { router } from "expo-router";

export const registerStepsField = [["email"], ["firstname", "lastname"], ["password", "rpassword"]];
export const registerStepsTitle = ["", "Személyes adatok", "Jelszó"];

export interface RegisterFormFieldType {
    email: string
    firstname: string
    lastname: string
    password: string
    rpassword: string
}

export const registerFormSchema = z
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

export const registerUseFormProps = {
    defaultValues: {
        email: "",
        firstname: "",
        lastname: "",
        password: "",
        rpassword: ""
    },
    resolver: zodResolver(registerFormSchema),
}

export const getRegisterHandleSubmit = ({ handleSubmit, database }: GetFormHandleSubmitArgs) =>
    handleSubmit(async ({ email, password, firstname, lastname }: RegisterFormFieldType) => {
        try {
            console.log(email, password, firstname, lastname)
            const response = await database.supabaseConnector?.client.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        firstname,
                        lastname
                    }
                }
            });
            if (response?.error){
                switch (response?.error?.message) {
                    case "User already registered":
                        Alert.alert("Az adott email címmel már létezik regisztrált fiók!")
                        break;
                    default:
                        Alert.alert("Valamilyen hiba lépett fel próbálja újra!")
                        break;
                }
                return;
            }
            router.replace({ pathname: "/" })
        } catch (error: any) {
            Alert.alert(error.message);
        }
    })