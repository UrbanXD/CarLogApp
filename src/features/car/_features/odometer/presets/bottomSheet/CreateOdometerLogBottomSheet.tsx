import React from "react";
import BottomSheet from "../../../../../../ui/bottomSheet/components/BottomSheet.tsx";
import { OdometerLogForm } from "../../components/forms/OdometerLogForm.tsx";
import { useLocalSearchParams } from "expo-router";

export function CreateOdometerLogBottomSheet() {
    const { carId } = useLocalSearchParams();

    const TITLE = "Kilométeróra-állás rögzítése";
    const CONTENT = <OdometerLogForm defaultCarId={ carId }/>;
    const SNAP_POINTS = ["90%"];

    return (
        <BottomSheet
            title={ TITLE }
            content={ CONTENT }
            snapPoints={ SNAP_POINTS }
            enableDismissOnClose={ false }
            enableDynamicSizing={ false }
            enableOverDrag={ false }
        />
    );
}