import { getToastMessage } from "../../../ui/alert/utils/getToastMessage.ts";
import { SignUpToast } from "../presets/toast/index.ts";
import { OtpVerificationBottomSheet } from "../presets/bottomSheet/index.ts";
import { AuthError } from "@supabase/supabase-js";
import { AVATAR_COLOR } from "../../../constants/index.ts";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { useAuth } from "../../../contexts/auth/AuthContext.ts";
import { useAlert } from "../../../ui/alert/hooks/useAlert.ts";
import { router } from "expo-router";
import { OtpVerificationHandlerType } from "../../../app/bottomSheet/otpVerification.tsx";
import { SignUpFormFieldType } from "../schemas/userSchema.tsx";

export const useSignUp = () => {
    const database = useDatabase();
    const { supabaseConnector, userDAO } = database;
    const { updateNotVerifiedUser } = useAuth();
    const { openToast } = useAlert();

    const openUserVerification = (email: string) => {
        router.push({
            pathname: "bottomSheet/otpVerification",
            params: {
                type: "signup",
                title: "Email cím hitelesítés",
                email,
                handlerType: OtpVerificationHandlerType.SignUp
            }
        });
    };

    const signUp = async (user: SignUpFormFieldType) => {
        try {
            const {
                email,
                password,
                firstname,
                lastname
            } = user;

            // mivel van email hitelesites, igy a supabase nem dob hibat, ha mar letezo emaillel regisztral
            const {
                data: emailExists,
                error: emailError
            } =
                await supabaseConnector
                .client
                .rpc(
                    "email_exists",
                    { email_address: email }
                );

            if(emailError) throw emailError;
            if(emailExists) throw { code: "email_exists" } as AuthError;

            const {
                data: { user: newUser },
                error
            } = await supabaseConnector
            .client
            .auth
            .signUp({
                email,
                password,
                options: {
                    data: {
                        firstname,
                        lastname,
                        avatarColor: AVATAR_COLOR[Math.floor(Math.random() * AVATAR_COLOR.length)]
                    }
                }
            });

            if(error) throw error;

            void updateNotVerifiedUser(newUser);

            if(!newUser?.email) return;

            openUserVerification(newUser.email);
            await userDAO.insertUser({
                id: newUser.id,
                email: newUser.email,
                firstname: newUser.user_metadata.firstname,
                lastname: newUser.user_metadata.lastname,
                avatarColor: newUser.user_metadata.avatarColor,
                avatarImage: newUser.user_metadata.avatarImage
            });
        } catch(error) {
            openToast(getToastMessage({ messages: SignUpToast, error }));
        }
    };

    return { openUserVerification, signUp };
};