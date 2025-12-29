import React from "react";
import OtpVerificationBottomSheet from "../../features/user/presets/bottomSheet/OtpVerificationBottomSheet.tsx";
import { useLocalSearchParams } from "expo-router";
import { EmailOtpType } from "@supabase/supabase-js";
import {
    OtpVerificationHandlerType,
    useOtpVerificationHandler
} from "../../features/user/hooks/useOtpVerificationHandler.ts";

type OtpVerificationLocalSearchParams = {
    type: EmailOtpType
    handlerType: OtpVerificationHandlerType
    title: string
    email: string
    userId?: string
    newPassword?: string
    newEmail?: string
    automaticResend?: boolean
}

const Page: React.FC = () => {
    const {
        type,
        handlerType,
        title,
        email,
        newEmail,
        newPassword,
        userId,
        automaticResend
    } = useLocalSearchParams<OtpVerificationLocalSearchParams>();
    const {
        handleSignUpVerification,
        handleCurrentEmailVerification,
        handleNewEmailVerification,
        handlePasswordResetVerification,
        handleUserDeleteVerification
    } = useOtpVerificationHandler();

    let handleVerification = () => {};
    switch(Number(handlerType)) {
        case OtpVerificationHandlerType.SignUp:
            handleVerification = handleSignUpVerification;
            break;
        case OtpVerificationHandlerType.CurrentEmailChange:
            handleVerification = handleCurrentEmailVerification(newEmail);
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

    return (
        <OtpVerificationBottomSheet
            type={ type }
            title={ title }
            email={ email }
            handleVerification={ handleVerification }
            automaticResend={ automaticResend }
        />
    );
};

export default Page;