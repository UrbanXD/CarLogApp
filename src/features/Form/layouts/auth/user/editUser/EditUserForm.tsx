import React from "react";
import { useEditUserForm } from "./useEditUserForm.tsx";
import { User } from "@supabase/supabase-js";
import EditForm from "../../../../components/EditForm.tsx";

export interface EditUserFormProps {
    user: Partial<User>
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