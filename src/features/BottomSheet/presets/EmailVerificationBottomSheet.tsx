import React from "react";
import { OpenBottomSheetArgs } from "../context/BottomSheetContext.ts";
import VerifyOTP from "../../Auth/components/VerifyOTP.tsx";
import signUpToast from "../../Alert/presets/toast/SignUpToast.ts";
import {AddToastFunction} from "../../Alert/constants/constants.ts";

export const EmailVerificationBottomSheet: (addToast: AddToastFunction) => OpenBottomSheetArgs = () => {
    return {
        snapPoints: ["100%"],
            content:
        <VerifyOTP
            type="signup"
            title="Email cím hitelesítés"
            email={ notVerifiedUser.email }
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