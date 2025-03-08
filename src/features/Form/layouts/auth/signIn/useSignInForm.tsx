import { useForm } from "react-hook-form";
import { SignInFormFieldType, useSignInFormProps } from "../../../constants/schemas/signInSchema";
import { useUserManagement } from "../../../../../hooks/useUserManagement.ts";

const useSignInForm = () => {
    const {
        control,
        handleSubmit
    } = useForm<SignInFormFieldType>(useSignInFormProps);
    const { signIn } = useUserManagement();

    const submitHandler =
        handleSubmit(
        async (user: SignInFormFieldType) =>
            await signIn(user)
        );

    return {
        control,
        submitHandler
    }
}

export default useSignInForm;