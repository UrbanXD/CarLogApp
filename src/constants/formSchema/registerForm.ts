import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Alert} from "react-native";
import {GetFormHandleSubmitArgs} from "../constants";
import {LoginFormFieldType} from "./loginForm";
import {router} from "expo-router";

export const registerStepsField = [["email"], ["firstname", "lastname"], ["password", "rpassword"]];

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
        firstname: z.string(),
        lastname: z.string(),
        password: z.string().min(5, "rovid").max(8),
        rpassword: z.string()
    })
    .refine(data => data.password === data.rpassword, {
        message: "Nem azonos jelszok",
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

export const getRegisterHandleSubmit = ({ handleSubmit, supabaseConnector }: GetFormHandleSubmitArgs) =>
    handleSubmit(async ({ email, password, firstname, lastname }: RegisterFormFieldType) => {
        try {
            console.log(email, password, firstname, lastname)
            const response = await supabaseConnector?.client.auth.signUp({
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










//
//
// export interface RegisterStepOneFormFieldType {
//     email: string
// }
//
// export interface RegisterStepTwoFormFieldType {
//     firstname: string,
//     lastname: string
// } //isDriver
//
// export interface RegisterStepThreeFormFieldType {
//     password: string,
//     rpassword: string,
// }
//
// export const registerFormSchemas = {
//     stepOne: z.object({ email: z.string().email("Nem megfelelő email cím formátum") }),
//     stepTwo: z.object({
//         firstname: z.string(),
//         lastname: z.string()
//     }),
//     stepThree: z
//         .object({
//             password: z.string().min(5, "rovid").max(8),
//             rpassword: z.string(),
//         })
//         .refine(data => data.password === data.rpassword, {
//             message: "Nem azonos jelszok",
//             path: ["rpassword"]
//         })
// }
//
// export const registerUseFormProps = {
//     stepOne: {
//         defaultValues: { email: "" },
//         resolver: zodResolver(registerFormSchemas.stepOne),
//     },
//     stepTwo: {
//         defaultValues: {
//             firstname: "",
//             lastname: ""
//         },
//         resolver: zodResolver(registerFormSchemas.stepTwo),
//     },
//     stepThree: {
//         defaultValues: {
//             password: "",
//             rpassword: "",
//         },
//         resolver: zodResolver(registerFormSchemas.stepThree),
//     }
// }
//
// export const registerFormHandleSubmits = {
//     stepOne: ({ handleSubmit, onSubmit = () => {} }: GetFormHandleSubmitArgs) => (
//         handleSubmit(async ({ email }: RegisterStepOneFormFieldType) => {
//             try {
//                 onSubmit({ email });
//             } catch (error: any) {
//                 Alert.alert(error.message);
//             }
//         })
//     ),
//     stepTwo: ({ handleSubmit, onSubmit = () => {} }: GetFormHandleSubmitArgs) => (
//         handleSubmit(async ({ firstname, lastname }: RegisterStepTwoFormFieldType) => {
//             try {
//                 onSubmit(firstname, lastname);
//             } catch (error: any) {
//                 Alert.alert(error.message);
//             }
//         })
//     ),
//     stepThree: ({ handleSubmit, onSubmit = () => {} }: GetFormHandleSubmitArgs) => (
//         handleSubmit(async ({ password }: RegisterStepThreeFormFieldType) => {
//             try {
//                 onSubmit(password);
//             } catch (error: any) {
//                 Alert.alert(error.message);
//             }
//         })
//     )
// }