import { UserFormFieldType, useUserFormProps } from "../../../../constants/schemas/userSchema.tsx";
import { useForm } from "react-hook-form";
import { EDIT_USER_FORM_STEPS, useEditUserSteps } from "./useEditUserSteps.tsx";
import { useUserManagement } from "../../../../../../hooks/useUserManagement.ts";

export const useEditUserForm = (
    user: Partial<UserFormFieldType>,
    passwordReset: boolean = true,
    stepIndex: number
) => {
    const {
        addPasswordToOAuthUser,
        resetPassword,
        changeEmail,
        changeName
    } = useUserManagement();

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
                    console.log("lol")
                    if(!editedUser.password) return;
                    console.log("lol")
                    if(passwordReset) return await resetPassword(editedUser.password);
                    await addPasswordToOAuthUser(editedUser.password);
                    break;
                case EDIT_USER_FORM_STEPS.NameStep:
                    await changeName(editedUser.firstname ?? "", editedUser.lastname ?? "");
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