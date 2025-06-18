import React from "react";
import { OpenBottomSheetArgs } from "../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import VerifyOtpForm, { HandleVerificationOtpType } from "../../components/forms/VerifyOtpForm.tsx";
import { EmailOtpType } from "@supabase/supabase-js";

type OtpVerificationBottomSheetArgs = {
    type: EmailOtpType
    title: string
    email: string
    handleVerification: HandleVerificationOtpType
}

type OtpVerificationBottomSheetType = (args: OtpVerificationBottomSheetArgs) => OpenBottomSheetArgs;

export const OtpVerificationBottomSheet: OtpVerificationBottomSheetType = ({
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