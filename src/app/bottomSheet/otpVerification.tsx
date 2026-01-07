import React from "react";
import OtpVerificationBottomSheet from "../../features/user/presets/bottomSheet/OtpVerificationBottomSheet.tsx";
import { useLocalSearchParams } from "expo-router";
import {
    OtpVerificationHandlerType,
    useOtpVerificationHandler
} from "../../features/user/hooks/useOtpVerificationHandler.ts";
import { useOtp } from "../../features/user/hooks/useOtp.ts";

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
    } = useLocalSearchParams();

    const {
        handleSignUpVerification,
        handleCurrentEmailVerification,
        handleNewEmailVerification,
        handlePasswordResetVerification,
        handleUserDeleteVerification
    } = useOtpVerificationHandler();
    const { setOTPTimeLimitStorage } = useOtp();

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

    if(setOtpLastSend === undefined || setOtpLastSend === "true") {
        setOTPTimeLimitStorage(type, email);
    }

    return (
        <OtpVerificationBottomSheet
            type={ type }
            title={ title }
            email={ email }
            handleVerification={ handleVerification }
            automaticResend={ automaticResend === "true" }
        />
    );
};

export default Page;