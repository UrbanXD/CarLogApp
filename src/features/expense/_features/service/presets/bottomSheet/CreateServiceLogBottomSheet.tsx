import BottomSheet from "../../../../../../ui/bottomSheet/components/BottomSheet.tsx";
import React from "react";
import { CreateServiceLogForm } from "../../components/forms/CreateServiceLogForm.tsx";

export function CreateServiceLogBottomSheet() {
    const TITLE = "Szervíz rögzítése";
    const CONTENT = <CreateServiceLogForm/>;
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