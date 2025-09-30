import React from "react";
import BottomSheet from "../../../../../../ui/bottomSheet/components/BottomSheet.tsx";
import { CreateOdometerLogForm } from "../../components/forms/CreateOdometerLogForm.tsx";

export function CreateOdometerLogBottomSheet() {
    const TITLE = "Kilométeróra-állás rögzítése";
    const CONTENT = <CreateOdometerLogForm/>;
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