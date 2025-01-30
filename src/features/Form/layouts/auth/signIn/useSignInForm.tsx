import { useAuth } from "../../../../Auth/context/AuthProvider";
import { useAlert } from "../../../../Alert/context/AlertProvider";
import { useForm } from "react-hook-form";
import { SignInFormFieldType, useSignInFormProps } from "../../../constants/schemas/signInSchema";
import { AuthApiError } from "@supabase/supabase-js";
import signInToast from "../../../../Alert/layouts/toast/signInToast";
import signUpToast from "../../../../Alert/layouts/toast/signUpToast";
import { router } from "expo-router";

const useSignInForm = (
    forceCloseBottomSheet: () => void
) => {
    const { signIn } = useAuth();
    const { addToast } = useAlert();

    const {
       control,
        handleSubmit
    } = useForm<SignInFormFieldType>(useSignInFormProps);

    const submitHandler =
        handleSubmit(async (user: SignInFormFieldType) => {
            try {
                await signIn(user.email, user.password);

                forceCloseBottomSheet();
            } catch (error: AuthApiError | any) {
                if(error.code) {
                    if(error.code === "email_not_confirmed") {
                        router.push({
                            pathname: "/verify",
                            params: {
                                type: "signup",
                                title: "Email cím hitelesítés",
                                email: user.email,
                                toastMessages: JSON.stringify(signInToast),
                                replaceHREF: "/(main)"
                            }
                        });

                        return;
                    }

                    const toastMessage = signInToast[error.code];
                    if(toastMessage) return addToast(toastMessage);

                    return addToast(signInToast.error);
                }

                console.error("hiba input useSignIn auth api")
                addToast(signInToast.error);
            }
        })

    return {
        control,
        submitHandler
    }
}

export default useSignInForm;