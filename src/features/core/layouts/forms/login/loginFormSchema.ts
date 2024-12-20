import { z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GetFormHandleSubmitArgs } from "../../../constants/constants";
import { Alert } from "react-native";

export interface LoginFormFieldType {
    email: string
    password: string
}

export const loginFormSchema = z
    .object({
        email: z.string().email("Nem megfelelő email cím formátum"),
        password: z.string(),
    })

export const loginUseFormProps = {
    defaultValues: {
        email: "",
        password: "",
    },
    resolver: zodResolver(loginFormSchema),
}

export const getLoginHandleSubmit = ({ handleSubmit, supabaseConnector }: GetFormHandleSubmitArgs) =>
    handleSubmit(async ({ email, password }: LoginFormFieldType) => {
        try {
            await supabaseConnector?.login(email, password);
        } catch (error: any) {
            Alert.alert(error.message);
        }
    })

export type GetLoginHandleSubmitType = (typeof getLoginHandleSubmit);