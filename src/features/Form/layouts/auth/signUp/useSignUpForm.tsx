import { useForm } from "react-hook-form";
import { SignUpFormFieldType, useSignUpFormProps } from "../../../constants/schemas/signUpSchema";
import { useAuth } from "../../../../Auth/context/AuthProvider";
import useSignUpSteps from "./steps/useSignUpSteps";

const useSignUpForm = (
    forceCloseBottomSheet: () => void
) => {
    const { signUp } = useAuth();

    const {
        control,
        handleSubmit,
        trigger,
        resetField
    } = useForm<SignUpFormFieldType>(useSignUpFormProps);

    const submitHandler =
        handleSubmit(
        async (newUser: SignUpFormFieldType) =>
            await signUp(newUser, forceCloseBottomSheet)
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