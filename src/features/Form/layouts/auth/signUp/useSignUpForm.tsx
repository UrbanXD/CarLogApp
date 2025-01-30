import { useAlert } from "../../../../Alert/context/AlertProvider";
import { useForm } from "react-hook-form";
import { SignUpFormFieldType, useSignUpFormProps } from "../../../constants/schemas/signUpSchema";
import { useAuth } from "../../../../Auth/context/AuthProvider";
import useSignUpSteps from "./steps/useSignUpSteps";
import { AuthApiError } from "@supabase/supabase-js";
import signUpToast from "../../../../Alert/layouts/toast/signUpToast";

const useSignUpForm = (
    forceCloseBottomSheet: () => void
) => {
    const { signUp } = useAuth();
    const { addToast } = useAlert();

    const {
        control,
        handleSubmit,
        trigger,
        resetField
    } = useForm<SignUpFormFieldType>(useSignUpFormProps);

    const submitHandler =
        handleSubmit(async (newUser: SignUpFormFieldType) => {
           try {
               await signUp(newUser.email, newUser.password, newUser.firstname, newUser.lastname);

               forceCloseBottomSheet();
           } catch (error: AuthApiError | any) {
               if(error.code) {
                   const toastMessage = signUpToast[error.code];
                   if(toastMessage) return addToast(toastMessage);

                   return addToast(signUpToast.error);
               }

               addToast(signUpToast.error);
           }
        });

    return {
        control,
        submitHandler,
        trigger,
        resetField,
        steps: useSignUpSteps(control)
    }
}

export default useSignUpForm;