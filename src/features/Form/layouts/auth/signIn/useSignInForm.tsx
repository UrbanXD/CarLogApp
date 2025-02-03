import { useAuth } from "../../../../Auth/context/AuthProvider";
import { useAlert } from "../../../../Alert/context/AlertProvider";
import { useForm } from "react-hook-form";
import { SignInFormFieldType, useSignInFormProps } from "../../../constants/schemas/signInSchema";

const useSignInForm = (
    forceCloseBottomSheet: () => void
) => {
    const { signIn } = useAuth();

    const {
       control,
        handleSubmit
    } = useForm<SignInFormFieldType>(useSignInFormProps);

    const submitHandler =
        handleSubmit(
        async (user: SignInFormFieldType) =>
                await signIn(user, forceCloseBottomSheet)
        );

    return {
        control,
        submitHandler
    }
}

export default useSignInForm;