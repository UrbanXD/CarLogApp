import { useForm } from "react-hook-form";
import { SignUpFormFieldType, useSignUpFormProps } from "../../../constants/schemas/signUpSchema";
import useSignUpSteps from "./steps/useSignUpSteps";
import useAuth from "../../../../../hooks/useAuth.tsx";

const useSignUpForm = () => {
    const {
        control,
        handleSubmit,
        trigger,
        resetField
    } = useForm<SignUpFormFieldType>(useSignUpFormProps);
    const { signUp } = useAuth();

    const submitHandler =
        handleSubmit(
        async (newUser: SignUpFormFieldType) =>
            await signUp(newUser)
        );

    return {
        control,
        submitHandler,
        trigger,
        resetField,
        steps: useSignUpSteps(control)
    }
}

export default useSignUpForm;