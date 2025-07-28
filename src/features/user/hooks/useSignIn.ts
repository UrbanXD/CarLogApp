import { SignInFormFieldType } from "../schemas/userSchema.tsx";
import { router } from "expo-router";
import { SignInToast } from "../presets/toast/index.ts";
import { getToastMessage } from "../../../ui/alert/utils/getToastMessage.ts";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../ui/bottomSheet/contexts/BottomSheetContext.ts";

export const useSignIn = () => {
    const database = useDatabase();
    const { supabaseConnector } = database;
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();

    const signIn = async (user: SignInFormFieldType) => {
        try {
            const { error } =
                await supabaseConnector
                .client
                .auth
                .signInWithPassword(user);

            if(error) {
                if(error.code === "email_not_confirmed") {
                    return openUserVerification(user.email);
                }

                throw error;
            }

            router.dismissTo("auth");
            openToast(SignInToast.success());
        } catch(error) {
            openToast(
                getToastMessage({
                    messages: SignInToast,
                    error
                })
            );
        }
    };

    return { signIn };
};