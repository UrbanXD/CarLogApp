import BottomSheet from "../../../../ui/bottomSheet/components/BottomSheet.tsx";
import React from "react";
import { CreateExpenseForm } from "../../components/forms/CreateExpenseForm.tsx";

export function CreateExpenseBottomSheet() {
    const TITLE = "Kiadás rögzítése";
    const CONTENT = <CreateExpenseForm/>;
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