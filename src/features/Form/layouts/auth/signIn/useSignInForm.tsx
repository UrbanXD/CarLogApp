import { useForm } from "react-hook-form";
import { SignInFormFieldType, useSignInFormProps } from "../../../constants/schemas/signInSchema";
import useAuth from "../../../../../hooks/useAuth.tsx";

const useSignInForm = () => {
    const {
        control,
        handleSubmit
    } = useForm<SignInFormFieldType>(useSignInFormProps);
    const { signIn } = useAuth();

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