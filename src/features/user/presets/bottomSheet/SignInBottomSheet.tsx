import React from "react";
import SignInForm from "../../components/forms/SignInForm.tsx";
import { OpenBottomSheetArgs } from "../../../../ui/bottomSheet/types/index.ts";

export const SignInBottomSheet: OpenBottomSheetArgs = {
    title: "Bejelentkezés",
    content: <SignInForm/>,
    snapPoints: ["90%"],
    enableDismissOnClose: false
};