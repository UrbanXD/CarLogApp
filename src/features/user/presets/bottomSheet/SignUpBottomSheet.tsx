import React from "react";
import { OpenBottomSheetArgs } from "../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import SignUpForm from "../../components/forms/SignUpForm.tsx";

export const SignUpBottomSheet: OpenBottomSheetArgs = {
    title: "Felhasználó létrehozás",
    content: <SignUpForm />,
    snapPoints: ["90%"],
    enableDismissOnClose: false
}