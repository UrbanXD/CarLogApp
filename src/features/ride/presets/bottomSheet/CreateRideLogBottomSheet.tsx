import React from "react";
import { CreateRideLogForm } from "../../components/forms/CreateRideLogForm.tsx";
import BottomSheet from "../../../../ui/bottomSheet/components/BottomSheet.tsx";

export function CreateRideLogBottomSheet() {
    const TITLE = "Út tervezése";
    const CONTENT = <CreateRideLogForm/>;
    const SNAP_POINTS = ["85%"];

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