import { useAuth } from "../../../../Auth/context/AuthProvider";
import { useForm } from "react-hook-form";
import { SignInFormFieldType, useSignInFormProps } from "../../../constants/schemas/signInSchema";

const useSignInForm = (
    dismissBottomSheet: () => void
) => {
    const { signIn } = useAuth();

    const {
       control,
        handleSubmit
    } = useForm<SignInFormFieldType>(useSignInFormProps);

    const submitHandler =
        handleSubmit(
        async (user: SignInFormFieldType) =>
            await signIn(user, dismissBottomSheet)
        );

    return {
        control,
        submitHandler
    }
}

export default useSignInForm;