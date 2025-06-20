import React from "react";
import EditForm from "../../../../components/Form/EditForm.tsx";
import { EditUserFormFieldType, useEditUserFormProps } from "../../schemas/userSchema.tsx";
import { useUserManagement } from "../../hooks/useUserManagement.ts";
import { useForm } from "react-hook-form";
import { EDIT_USER_FORM_STEPS, useEditUserSteps } from "../../hooks/useEditUserSteps.tsx";
import { ChangeNameToast, SignUpToast } from "../../presets/toast/index.ts";

export interface EditUserFormProps {
    user: Partial<EditUserFormFieldType>;
    passwordReset?: boolean;
    stepIndex: number;
}

export const EditUserForm: React.FC<EditUserFormProps> = ({
    user,
    passwordReset,
    stepIndex
}) => {
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
            switch(stepIndex) {
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
                    await changeUserMetadata(editedUser, SignUpToast);
                    break;
            }
        });

    return (
        <EditForm
            steps={ useEditUserSteps(control) }
            stepIndex={ stepIndex }
            submitHandler={ submitHandler }
            reset={ reset }
        />
    );
};