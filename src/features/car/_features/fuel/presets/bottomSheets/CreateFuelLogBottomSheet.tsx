import React from "react";
import BottomSheet from "../../../../../../ui/bottomSheet/components/BottomSheet.tsx";
import { CreateFuelLogForm } from "../../components/forms/CreateFuelLogForm.tsx";
import { useTranslation } from "react-i18next";

export function CreateFuelLogBottomSheet() {
    const { t } = useTranslation();

    const TITLE = t("fuel.create");
    const CONTENT = <CreateFuelLogForm/>;
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