import { useForm } from "react-hook-form";
import { SignUpFormFieldType, useSignUpFormProps } from "../../../constants/schemas/signUpSchema";
import useSignUpSteps from "./steps/useSignUpSteps";
import { SignUpFunction } from "../../../../Auth/context/AuthProvider.tsx";

const useSignUpForm = (signUp: SignUpFunction) => {
    const {
        control,
        handleSubmit,
        trigger,
        resetField
    } = useForm<SignUpFormFieldType>(useSignUpFormProps);

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