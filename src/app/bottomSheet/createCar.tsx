import React, { useCallback, useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router, useFocusEffect } from "expo-router";
import BottomSheet from "../../ui/bottomSheet/components/BottomSheet.tsx";
import NewCarForm from "../../features/car/components/forms/NewCarForm.tsx";

const Page: React.FC = () => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const TITLE = "Autó létrehozás";
    const CONTENT = <NewCarForm/>;
    const SNAP_POINTS = ["85%"];

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
            snapPoints={ SNAP_POINTS }
            enableDynamicSizing={ false }
            enableOverDrag={ false }
            // enableDismissOnClose={ false }
            onDismiss={ onBottomSheetDismiss }
        />
    );
};

export default Page;
