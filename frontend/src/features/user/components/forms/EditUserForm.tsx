import React from "react";
import EditForm from "../../../../components/Form/EditForm.tsx";
import { User } from "../../schemas/userSchema.tsx";
import { useUserManagement } from "../../hooks/useUserManagement.ts";
import { useForm } from "react-hook-form";
import { EDIT_USER_FORM_STEPS, useEditUserSteps } from "../../hooks/useEditUserSteps.tsx";
import { ChangeNameToast, SignUpToast } from "../../presets/toast/index.ts";
import { EditUserRequest, useEditUserFormProps } from "../../schemas/editUserRequestSchema.ts";

export interface EditUserFormProps {
    user: User;
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
    } = useForm<EditUserRequest>(useEditUserFormProps(user));

    const submitHandler =
        handleSubmit(async (request: EditUserRequest) => {
            switch(stepIndex) {
                case EDIT_USER_FORM_STEPS.EmailStep:
                    if(!request.email) return;

                    await changeEmail(request.email);
                    break;
                case EDIT_USER_FORM_STEPS.PasswordStep:
                    if(!request.password) return;

                    if(passwordReset) return await resetPassword(request.password);

                    await addPasswordToOAuthUser(request.password);
                    break;
                case EDIT_USER_FORM_STEPS.NameStep:
                    await changeUserMetadata(request, ChangeNameToast);
                    break;
                case EDIT_USER_FORM_STEPS.AvatarStep:
                    await changeUserMetadata(request, SignUpToast);
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