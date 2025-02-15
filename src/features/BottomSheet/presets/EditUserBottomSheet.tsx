import { OpenBottomSheetArgs } from "../context/BottomSheetContext.ts";
import React from "react";
import { UserFormFieldType } from "../../Form/constants/schemas/userSchema.tsx";
import { EditUserForm } from "../../Form/layouts/auth/user/editUser/EditUserForm.tsx";

type EditUserBottomSheetType = (
    user: Partial<UserFormFieldType>,
    stepIndex: number
) => OpenBottomSheetArgs

export const EditUserBottomSheet: EditUserBottomSheetType = (
    user,
    stepIndex
) => {
    return {
        content:
            <EditUserForm
                user={ user }
                stepIndex={ stepIndex }
            />,
        snapPoints: ["40%"],
        enableDismissOnClose: false
    }
}