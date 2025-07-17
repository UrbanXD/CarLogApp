import React, { useCallback, useRef } from "react";
import SignInForm from "../../components/forms/SignInForm.tsx";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router, useFocusEffect } from "expo-router";
import BottomSheet from "../../../../ui/bottomSheet/components/BottomSheet.tsx";

const SignInBottomSheet: React.FC = () => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const TITLE = "Bejelentkezés";
    const CONTENT = <SignInForm/>;

    useFocusEffect(useCallback(() => {
        bottomSheetRef.current.present();

        return () => bottomSheetRef.current?.close();
    }, []));

    const onBottomSheetDismiss = () => router.dismiss();

    return (
        <BottomSheet
            ref={ bottomSheetRef }
            title={ TITLE }
            content={ CONTENT }
            enableDynamicSizing
            enableOverDrag={ false }
            // enableDismissOnClose={ false }
            onDismiss={ onBottomSheetDismiss }
        />
    );
};

export default SignInBottomSheet;