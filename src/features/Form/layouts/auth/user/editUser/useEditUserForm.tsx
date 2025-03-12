import { UserFormFieldType, useUserFormProps } from "../../../../constants/schemas/userSchema.tsx";
import { useForm } from "react-hook-form";
import { EDIT_USER_FORM_STEPS, useEditUserSteps } from "./useEditUserSteps.tsx";
import { useUserManagement } from "../../../../../../hooks/useUserManagement.ts";
import { ChangeNameToast } from "../../../../../Alert/presets/toast";

export const useEditUserForm = (
    user: Partial<UserFormFieldType>,
    passwordReset: boolean = true,
    stepIndex: number
) => {
    const {
        addPasswordToOAuthUser,
        resetPassword,
        changeEmail,
        changeUserMetadata
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
                    if(!editedUser.password) return;

                    if(passwordReset) return await resetPassword(editedUser.password);

                    await addPasswordToOAuthUser(editedUser.password);
                    break;
                case EDIT_USER_FORM_STEPS.NameStep:
                    await changeUserMetadata(editedUser, ChangeNameToast);
                    // await changeName(editedUser.firstname ?? "", editedUser.lastname ?? "");
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