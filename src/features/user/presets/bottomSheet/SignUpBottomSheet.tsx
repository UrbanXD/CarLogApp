import React from "react";
import SignUpForm from "../../components/forms/SignUpForm.tsx";
import { OpenBottomSheetArgs } from "../../../../ui/bottomSheet/types/index.ts";

export const SignUpBottomSheet: OpenBottomSheetArgs = {
    title: "Felhasználó létrehozás",
    content: <SignUpForm/>,
    snapPoints: ["90%"],
    enableDismissOnClose: false
};