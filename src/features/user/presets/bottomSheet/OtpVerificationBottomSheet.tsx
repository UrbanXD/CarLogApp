import React from "react";
import VerifyOtpForm, { HandleVerificationOtpType } from "../../components/forms/VerifyOtpForm.tsx";
import { EmailOtpType } from "@supabase/supabase-js";
import BottomSheet from "../../../../ui/bottomSheet/components/BottomSheet.tsx";

type OtpVerificationBottomSheetProps = {
    type: EmailOtpType
    title: string
    email: string
    handleVerification: HandleVerificationOtpType
}

const OtpVerificationBottomSheet: React.FC<OtpVerificationBottomSheetProps> = ({
    type,
    title,
    email,
    handleVerification
}) => {
    const CONTENT =
        <VerifyOtpForm
            type={ type }
            title={ title }
            email={ email }
            handleVerification={ handleVerification }
        />;
    const SNAP_POINTS = ["100%"];

    return (
        <BottomSheet
            content={ CONTENT }
            snapPoints={ SNAP_POINTS }
            enableDynamicSizing={ false }
            enableOverDrag={ false }
            enableDismissOnClose={ true }
        />
    );
};

export default OtpVerificationBottomSheet;