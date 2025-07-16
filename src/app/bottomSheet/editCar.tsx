import React, { useCallback, useRef } from "react";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router, useFocusEffect } from "expo-router";
import BottomSheet from "../../ui/bottomSheet/components/BottomSheet.tsx";
import EditCarForm from "../../features/car/components/forms/EditCarForm.tsx";

const Page: React.FC = () => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const CONTENT = <EditCarForm car={ { name: "aeff" } } stepIndex={ 0 }/>;
    const MAX_DYNAMIC_CONTENT_SIZE = heightPercentageToDP(85);

    useFocusEffect(useCallback(() => {
        bottomSheetRef.current.present();

        return () => bottomSheetRef.current?.close();
    }, []));

    const onBottomSheetDismiss = () => router.dismiss();

    return (
        <BottomSheet
            ref={ bottomSheetRef }
            content={ CONTENT }
            maxDynamicContentSize={ MAX_DYNAMIC_CONTENT_SIZE }
            enableDynamicSizing
            enableOverDrag={ false }
            // enableDismissOnClose={ false }
            onDismiss={ onBottomSheetDismiss }
        />
    );
};

export default Page;
