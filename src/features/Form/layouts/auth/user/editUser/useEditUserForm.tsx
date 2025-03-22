import { EditUserFormFieldType, useEditUserFormProps } from "../../../../constants/schemas/userSchema.tsx";
import { useForm } from "react-hook-form";
import { EDIT_USER_FORM_STEPS, useEditUserSteps } from "./useEditUserSteps.tsx";
import { useUserManagement } from "../../../../../../hooks/useUserManagement.ts";
import {ChangeNameToast, SignUpToast} from "../../../../../Alert/presets/toast";

export const useEditUserForm = (
    user: Partial<EditUserFormFieldType>,
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
    } = useForm<Partial<EditUserFormFieldType>>(useEditUserFormProps(user));


    const submitHandler =
        handleSubmit(async (editedUser: Partial<EditUserFormFieldType>) => {
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
                    break;
                case EDIT_USER_FORM_STEPS.AvatarStep:
                    await changeUserMetadata(editedUser, SignUpToast)
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