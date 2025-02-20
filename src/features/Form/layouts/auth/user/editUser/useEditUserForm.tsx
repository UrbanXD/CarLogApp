import { UserFormFieldType, useUserFormProps } from "../../../../constants/schemas/userSchema.tsx";
import { useForm } from "react-hook-form";
import useAuth from "../../../../../../hooks/useAuth.tsx";
import { EDIT_USER_FORM_STEPS, useEditUserSteps } from "./useEditUserSteps.tsx";

export const useEditUserForm = (
    user: Partial<UserFormFieldType>,
    stepIndex: number
) => {
    const { resetPassword, changeEmail, changeName } = useAuth();

    const {
        control,
        handleSubmit,
        reset
    } = useForm<Partial<UserFormFieldType>>(useUserFormProps(user));


    const submitHandler =
        handleSubmit(async (editedUser: Partial<UserFormFieldType>) => {
            switch (stepIndex) {
                case EDIT_USER_FORM_STEPS.EmailStep:
                    if(!editedUser.email) return;

                    await changeEmail(editedUser.email);
                    break;
                case EDIT_USER_FORM_STEPS.PasswordStep:
                    if(!editedUser.password) return;

                    await resetPassword(editedUser.password);
                    break;
                case EDIT_USER_FORM_STEPS.NameStep:
                    await changeName(editedUser.firstname, editedUser.lastname);
                    break;
            }
        })

    return {
        control,
        submitHandler,
        reset,
        steps: useEditUserSteps(control)
    }
}