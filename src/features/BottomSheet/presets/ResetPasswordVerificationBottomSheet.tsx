import {AddToastFunction} from "../../Alert/constants/constants.ts";
import {OpenBottomSheetArgs} from "../context/BottomSheetContext.ts";
import VerifyOTP from "../../Auth/components/VerifyOTP.tsx";
import React from "react";
import {SupabaseConnector} from "../../Database/connector/SupabaseConnector.ts";
import {SignUpToast} from "../../Alert/presets/toast/index.ts";

type ResetPasswordVerificationBottomSheetType = (
    email: string,
    newPassword: string,
    supabaseConnector: SupabaseConnector,
    addToast: AddToastFunction
) => OpenBottomSheetArgs;

export const ResetPasswordVerificationBottomSheet: ResetPasswordVerificationBottomSheetType = (
    email,
    newPassword,
    supabaseConnector,
    addToast
) => {
    return {
        snapPoints: ["100%"],
        content:
            <VerifyOTP
                type="recovery"
                title="Jelszó módosítása"
                email={ email }
                handleVerification={
                    async (errorCode?: string) => {
                        console.log(errorCode, "apad", addToast)
                        if(errorCode) return addToast(SignUpToast[errorCode] || SignUpToast.otp_error);

                        addToast(SignUpToast.success);
                        console.log("before update")
                        await supabaseConnector
                            .client
                            .auth
                            .updateUser({ password: newPassword });
                        console.log("after update")
                    }
                }
            />,
        enableDismissOnClose: true
    }
}