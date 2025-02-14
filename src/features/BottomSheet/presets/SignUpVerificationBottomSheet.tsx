import React from "react";
import { OpenBottomSheetArgs } from "../context/BottomSheetContext.ts";
import VerifyOTP from "../../Auth/components/VerifyOTP.tsx";
import signUpToast from "../../Alert/presets/toast/SignUpToast.ts";
import { AddToastFunction } from "../../Alert/constants/constants.ts";

type SignUpVerificationBottomSheetType = (email: string, addToast: AddToastFunction) => OpenBottomSheetArgs;

export const SignUpVerificationBottomSheet: SignUpVerificationBottomSheetType = (
    email,
    addToast
) => {
    return {
        snapPoints: ["100%"],
        content:
            <VerifyOTP
                type="signup"
                title="Email cím hitelesítés"
                email={ email }
                handleVerification={
                    (errorCode?: string) => {
                        if(errorCode) return addToast(signUpToast[errorCode] || signUpToast.otp_error);

                        addToast(signUpToast.success);
                    }
                }
            />,
        enableDismissOnClose: true
    }
}