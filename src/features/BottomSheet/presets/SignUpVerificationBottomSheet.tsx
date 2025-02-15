import React from "react";
import { OpenBottomSheetArgs } from "../context/BottomSheetContext.ts";
import VerifyOTP, { HandleVerificationOtpType } from "../../Auth/components/VerifyOTP.tsx";

type SignUpVerificationBottomSheetType = (
    email: string,
    handleVerification: HandleVerificationOtpType
) => OpenBottomSheetArgs;

export const SignUpVerificationBottomSheet: SignUpVerificationBottomSheetType = (
    email,
    handleVerification
) => {
    return {
        snapPoints: ["100%"],
        content:
            <VerifyOTP
                type="signup"
                title="Email cím hitelesítés"
                email={ email }
                handleVerification={ handleVerification }
            />,
        enableDismissOnClose: true
    }
}