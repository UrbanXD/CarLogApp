import React, { useEffect } from "react";
import OtpVerificationBottomSheet from "../../features/user/presets/bottomSheet/OtpVerificationBottomSheet.tsx";
import { useLocalSearchParams } from "expo-router";
import {
    OtpVerificationHandlerType,
    useOtpVerificationHandler
} from "../../features/user/hooks/useOtpVerificationHandler.ts";
import { useOtp } from "../../features/user/hooks/useOtp.ts";
import { EmailOtpType } from "@supabase/supabase-js";

const Page: React.FC = () => {
    const {
        type,
        handlerType,
        title,
        email,
        newEmail,
        newPassword,
        userId,
        automaticResend,
        setOtpLastSend = "true"
    } = useLocalSearchParams<{
        type: string
        handlerType: string
        title: string
        email: string
        newEmail: string
        newPassword: string
        userId: string
        automaticResend: string
        setOtpLastSend: string
    }>();

    const {
        handleSignUpVerification,
        handleCurrentEmailVerification,
        handleNewEmailVerification,
        handlePasswordResetVerification,
        handleUserDeleteVerification
    } = useOtpVerificationHandler();

    const { setOTPTimeLimitStorage } = useOtp();

    let handleVerification = () => {};
    let dismissOnSuccess;
    switch(Number(handlerType)) {
        case OtpVerificationHandlerType.SignUp:
            handleVerification = handleSignUpVerification;
            break;
        case OtpVerificationHandlerType.CurrentEmailChange:
            handleVerification = handleCurrentEmailVerification(newEmail);
            dismissOnSuccess = false;
            break;
        case OtpVerificationHandlerType.NewEmailChange:
            handleVerification = handleNewEmailVerification;
            break;
        case OtpVerificationHandlerType.PasswordReset:
            handleVerification = handlePasswordResetVerification(newPassword);
            break;
        case OtpVerificationHandlerType.UserDelete:
            handleVerification = handleUserDeleteVerification(userId);
            break;
    }

    useEffect(() => {
        if(setOtpLastSend === undefined || setOtpLastSend === "true") {
            setOTPTimeLimitStorage(type, email);
        }
    }, [type, email, setOtpLastSend]);

    return (
        <OtpVerificationBottomSheet
            type={ type as EmailOtpType }
            title={ title }
            email={ email }
            handleVerification={ handleVerification }
            automaticResend={ automaticResend === "true" }
            dismissOnSuccess={ dismissOnSuccess }
        />
    );
};

export default Page;