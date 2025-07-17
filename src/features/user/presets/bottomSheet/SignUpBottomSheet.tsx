import React, { useCallback, useRef } from "react";
import SignUpForm from "../../components/forms/SignUpForm.tsx";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router, useFocusEffect } from "expo-router";
import BottomSheet from "../../../../ui/bottomSheet/components/BottomSheet.tsx";
import { heightPercentageToDP } from "react-native-responsive-screen";

const SignUpBottomSheet: React.FC = () => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const TITLE = "Felhasználó létrehozás";
    const CONTENT = <SignUpForm/>;
    const MAX_DYNAMIC_CONTENT_SIZE = heightPercentageToDP(85);

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
            maxDynamicContentSize={ MAX_DYNAMIC_CONTENT_SIZE }
            enableOverDrag={ false }
            // enableDismissOnClose={ false }
            onDismiss={ onBottomSheetDismiss }
        />
    );
};

export default SignUpBottomSheet;