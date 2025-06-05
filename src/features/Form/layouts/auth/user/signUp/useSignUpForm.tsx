import { useForm } from "react-hook-form";
import { SignUpFormFieldType, useSignUpFormProps } from "../../../../constants/schemas/userSchema.tsx";
import { useSignUpSteps } from "./useSignUpSteps.tsx";
import { useUserManagement } from "../../../../../../hooks/useUserManagement.ts";

const useSignUpForm = () => {
    const {
        control,
        handleSubmit,
        trigger,
        resetField
    } = useForm<SignUpFormFieldType>(useSignUpFormProps());
    const { signUp } = useUserManagement();

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