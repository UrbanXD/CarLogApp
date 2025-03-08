import { useForm } from "react-hook-form";
import { UserFormFieldType, useUserFormProps } from "../../../../constants/schemas/userSchema.tsx";
import { useSignUpSteps } from "./useSignUpSteps.tsx";
import { useUserManagement } from "../../../../../../hooks/useUserManagement.ts";

const useSignUpForm = () => {
    const {
        control,
        handleSubmit,
        trigger,
        resetField
    } = useForm<UserFormFieldType>(useUserFormProps());
    const { signUp } = useUserManagement();

    const submitHandler =
        handleSubmit(
        async (newUser: UserFormFieldType) =>
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