import React from "react";
import { OpenBottomSheetArgs } from "../../../contexts/BottomSheet/BottomSheetContext.ts";
import SignInForm from "../../../features/user/components/forms/SignInForm.tsx";

export const SignInBottomSheet: OpenBottomSheetArgs = {
    title: "Bejelentkezés",
    content: <SignInForm />,
    snapPoints: ["90%"],
    enableDismissOnClose: false
}