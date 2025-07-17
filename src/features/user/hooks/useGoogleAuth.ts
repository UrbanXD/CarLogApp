import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { AVATAR_COLOR, BaseConfig } from "../../../constants/index.ts";
import { GoogleAuthToast, SignInToast, SignUpToast } from "../presets/toast/index.ts";
import { getToastMessage } from "../../../ui/alert/utils/getToastMessage.ts";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../ui/alert/hooks/useAlert.ts";
import { router } from "expo-router";

export const useGoogleAuth = () => {
    GoogleSignin.configure({
        scopes: ["https://www.googleapis.com/auth/userinfo.profile"],
        webClientId: BaseConfig.GOOGLE_WEBCLIENTID
    });

    const database = useDatabase();
    const { supabaseConnector, userDAO } = database;
    const { openToast } = useAlert();

    const googleAuth = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const { data: googleData } = await GoogleSignin.signIn();
            if(!googleData?.idToken) throw { code: "token_missing" };

            const { data: alreadyRegistered } =
                await supabaseConnector
                .client
                .rpc(
                    "email_exists",
                    { email_address: googleData.user.email }
                );

            const { data: { user }, error } =
                await supabaseConnector
                .client
                .auth
                .signInWithIdToken({
                    provider: "google",
                    token: googleData.idToken
                });

            if(error) throw error;
            if(!user) throw { code: "user_not_found" };

            // login tortent igy a nevet ne mentsuk le
            if(alreadyRegistered) {
                openToast(SignInToast.success());
                return router.dismissTo("auth");
            }

            // uj fiok kerult letrehozasra, mentsuk le a nevet a felhasznalonak
            await userDAO.insertUser({
                id: user.id,
                email: user.email,
                firstname: googleData.user.givenName || "",
                lastname: googleData.user.familyName || "",
                avatarColor: AVATAR_COLOR[Math.floor(Math.random() * AVATAR_COLOR.length)],
                avatarImage: null
            });

            openToast(SignUpToast.success());
            return router.dismissTo("auth");
        } catch(error) {
            openToast(
                getToastMessage({
                    messages: GoogleAuthToast,
                    error
                })
            );
        }
    };

    return { googleAuth };
};