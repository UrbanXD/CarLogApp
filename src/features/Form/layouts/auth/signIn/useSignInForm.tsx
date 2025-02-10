import { SignInFunction } from "../../../../Auth/context/AuthProvider";
import { useForm } from "react-hook-form";
import { SignInFormFieldType, useSignInFormProps } from "../../../constants/schemas/signInSchema";

const useSignInForm = (signIn: SignInFunction) => {
    const {
        control,
        handleSubmit
    } = useForm<SignInFormFieldType>(useSignInFormProps);

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