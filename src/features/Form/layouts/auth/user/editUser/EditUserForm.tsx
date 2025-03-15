import React from "react";
import { useEditUserForm } from "./useEditUserForm.tsx";
import EditForm from "../../../../components/EditForm.tsx";
import { EditUserFormFieldType } from "../../../../constants/schemas/userSchema.tsx";

export interface EditUserFormProps {
    user: Partial<EditUserFormFieldType>
    passwordReset?: boolean
    stepIndex: number
}
export const EditUserForm: React.FC<EditUserFormProps> = ({
    user,
    passwordReset,
    stepIndex
}) => {
    const restProps =
        useEditUserForm(user, passwordReset, stepIndex);

    return (
        <EditForm
            stepIndex={ stepIndex }
            { ...restProps }
        />
    )
}