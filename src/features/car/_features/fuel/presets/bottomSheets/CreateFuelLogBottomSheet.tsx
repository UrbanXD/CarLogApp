import React from "react";
import { CreateExpenseForm } from "../../../../../expense/components/forms/CreateExpenseForm.tsx";
import BottomSheet from "../../../../../../ui/bottomSheet/components/BottomSheet.tsx";

export function CreateFuelLogBottomSheet() {
    const TITLE = "Tankolás rögzítése";
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