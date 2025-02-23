import { OpenBottomSheetArgs } from "../context/BottomSheetContext.ts";
import React from "react";
import { EditUserForm, EditUserFormProps } from "../../Form/layouts/auth/user/editUser/EditUserForm.tsx";

type EditUserBottomSheetType = (args: EditUserFormProps) => OpenBottomSheetArgs

export const EditUserBottomSheet: EditUserBottomSheetType = (args) => {
    return {
        content:
            <EditUserForm
                { ...args }
            />,
        snapPoints: ["40%"],
        enableDismissOnClose: false
    }
}