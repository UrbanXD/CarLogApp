import React, { useCallback, useRef } from "react";
import VerifyOtpForm, { HandleVerificationOtpType } from "../../components/forms/VerifyOtpForm.tsx";
import { EmailOtpType } from "@supabase/supabase-js";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router, useFocusEffect } from "expo-router";
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
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const CONTENT =
        <VerifyOtpForm
            type={ type }
            title={ title }
            email={ email }
            handleVerification={ handleVerification }
        />;
    const SNAP_POINTS = ["100%"];

    useFocusEffect(useCallback(() => {
        bottomSheetRef.current.present();

        return () => bottomSheetRef.current?.close();
    }, []));

    const onBottomSheetDismiss = () => router.dismiss();

    return (
        <BottomSheet
            ref={ bottomSheetRef }
            content={ CONTENT }
            snapPoints={ SNAP_POINTS }
            enableDynamicSizing={ false }
            enableOverDrag={ false }
            onDismiss={ onBottomSheetDismiss }
        />
    );
};

export default OtpVerificationBottomSheet;