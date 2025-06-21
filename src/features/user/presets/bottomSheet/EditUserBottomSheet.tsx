import React from "react";
import { EditUserForm, EditUserFormProps } from "../../components/forms/EditUserForm.tsx";
import { OpenBottomSheetArgs } from "../../../../ui/bottomSheet/types/index.ts";

type EditUserBottomSheetType = (args: EditUserFormProps) => OpenBottomSheetArgs

export const EditUserBottomSheet: EditUserBottomSheetType = (args) => {
    return {
        content:
            <EditUserForm
                { ...args }
            />,
        snapPoints: ["40%"],
        enableDismissOnClose: false
    };
};