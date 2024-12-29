import { z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GetFormHandleSubmitArgs } from "../../../Shared/constants/constants";
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

export const getLoginHandleSubmit = ({ handleSubmit, database, onSubmit }: GetFormHandleSubmitArgs) =>
    handleSubmit(async ({ email, password }: LoginFormFieldType) => {
        try {
            await database.supabaseConnector?.login(email, password);

            if(onSubmit) {
                onSubmit(true);
            }
        } catch (error: any) {
            if(onSubmit) {
                onSubmit(false);
            }
        }
    })

export type GetLoginHandleSubmitType = (typeof getLoginHandleSubmit);