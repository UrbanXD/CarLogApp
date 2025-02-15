import { OpenBottomSheetArgs } from "../context/BottomSheetContext.ts";
import VerifyOTP, { HandleVerificationOtpType } from "../../Auth/components/VerifyOTP.tsx";
import React from "react";

type ResetPasswordVerificationBottomSheetType = (
    email: string,
    handleVerification: HandleVerificationOtpType
) => OpenBottomSheetArgs;

export const ResetPasswordVerificationBottomSheet: ResetPasswordVerificationBottomSheetType = (
    email,
    handleVerification
) => {
    return {
        snapPoints: ["100%"],
        content:
            <VerifyOTP
                type="recovery"
                title="Jelszó módosítása"
                email={ email }
                handleVerification={ handleVerification }
            />,
        enableDismissOnClose: true
    }
}