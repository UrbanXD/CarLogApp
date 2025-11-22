import BottomSheet from "../../../../../../ui/bottomSheet/components/BottomSheet.tsx";
import React from "react";
import { CreateServiceLogForm } from "../../components/forms/CreateServiceLogForm.tsx";
import { useTranslation } from "react-i18next";

export function CreateServiceLogBottomSheet() {
    const { t } = useTranslation();

    const TITLE = t("service.create");
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