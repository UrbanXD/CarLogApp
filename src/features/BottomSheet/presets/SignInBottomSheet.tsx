import React from "react";
import { OpenBottomSheetArgs } from "../context/BottomSheetContext.ts";
import SignInForm from "../../Form/layouts/auth/signIn/SignInForm.tsx";

export const SignInBottomSheet: OpenBottomSheetArgs = {
    title: "Bejelentkezés",
    content: <SignInForm />,
    snapPoints: ["90%"],
    enableDismissOnClose: false
}