import React from "react";
import { OpenBottomSheetArgs } from "../../../contexts/BottomSheet/BottomSheetContext.ts";
import VerifyOtpForm, { HandleVerificationOtpType } from "../../../features/user/components/forms/VerifyOtpForm.tsx";
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
            <VerifyOtpForm
                type={ type }
                title={ title }
                email={ email }
                handleVerification={ handleVerification }
            />,
        enableDismissOnClose: true
    }
}