import React from "react";
import { OpenBottomSheetArgs } from "../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import SignInForm from "../../components/forms/SignInForm.tsx";

export const SignInBottomSheet: OpenBottomSheetArgs = {
    title: "Bejelentkezés",
    content: <SignInForm />,
    snapPoints: ["90%"],
    enableDismissOnClose: false
}