import React from "react";
import BottomSheet from "../../../../../../ui/bottomSheet/components/BottomSheet.tsx";
import { useLocalSearchParams } from "expo-router";
import { CreateOdometerLogForm } from "../../components/forms/CreateOdometerLogForm.tsx";
import { heightPercentageToDP } from "react-native-responsive-screen";

export function CreateOdometerLogBottomSheet() {
    const { carId } = useLocalSearchParams();

    const TITLE = "Kilométeróra-állás rögzítése";
    const CONTENT = <CreateOdometerLogForm defaultCarId={ carId }/>;
    const MAX_DYNAMIC_CONTENT_SIZE = heightPercentageToDP(85);

    return (
        <BottomSheet
            title={ TITLE }
            content={ CONTENT }
            maxDynamicContentSize={ MAX_DYNAMIC_CONTENT_SIZE }
            enableDynamicSizing
            enableDismissOnClose={ false }
            enableOverDrag={ false }
        />
    );
}