import React from "react";
import { OpenBottomSheetArgs } from "../context/BottomSheetContext.ts";
import VerifyOTP, { HandleVerificationOtpType } from "../../Form/layouts/auth/otp/VerifyOTP.tsx";
import { EmailOtpType } from "@supabase/supabase-js";

type OtpVerificationBottomSheetArgs = {
    type: EmailOtpType
    title: string
    email: string
    handleVerification: HandleVerificationOtpType
}

type OTPVerificationBottomSheetType = (args: OtpVerificationBottomSheetArgs) => OpenBottomSheetArgs;

export const OTPVerificationBottomSheet: OTPVerificationBottomSheetType = ({
    type,
    title,
    email,
    handleVerification
}) => {
    return {
        snapPoints: ["100%"],
        content:
            <VerifyOTP
                type={ type }
                title={ title }
                email={ email }
                handleVerification={ handleVerification }
            />,
        enableDismissOnClose: true
    }
}