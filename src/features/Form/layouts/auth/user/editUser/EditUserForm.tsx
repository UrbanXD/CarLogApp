import React from "react";
import { useEditUserForm } from "./useEditUserForm.tsx";
import { User } from "@supabase/supabase-js";
import EditForm from "../../../../components/EditForm.tsx";

interface EditUserFormProps {
    user: Partial<User>
    stepIndex: number
}
export const EditUserForm: React.FC<EditUserFormProps> = ({
    user,
    stepIndex
}) => {
    const restProps =
        useEditUserForm(user, stepIndex)

    return (
        <EditForm
            stepIndex={ stepIndex }
            { ...restProps }
        />
    )
}