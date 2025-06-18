import React from "react";
import { OpenBottomSheetArgs } from "../../../contexts/BottomSheet/BottomSheetContext.ts";
import SignUpForm from "../../../features/user/components/forms/SignUpForm.tsx";

export const SignUpBottomSheet: OpenBottomSheetArgs = {
    title: "Felhasználó létrehozás",
    content: <SignUpForm />,
    snapPoints: ["90%"],
    enableDismissOnClose: false
}