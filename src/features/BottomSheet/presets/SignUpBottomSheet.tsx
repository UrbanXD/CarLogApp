import React from "react";
import { OpenBottomSheetArgs } from "../context/BottomSheetContext.ts";
import SignUpForm from "../../Form/layouts/auth/user/signUp/SignUpForm.tsx";

export const SignUpBottomSheet: OpenBottomSheetArgs = {
    title: "Felhasználó létrehozás",
    content: <SignUpForm />,
    snapPoints: ["90%"],
    enableDismissOnClose: false
}