import React from "react";
import { CreateRideLogForm } from "../../components/forms/CreateRideLogForm.tsx";
import BottomSheet from "../../../../ui/bottomSheet/components/BottomSheet.tsx";
import { useTranslation } from "react-i18next";

export function CreateRideLogBottomSheet() {
    const { t } = useTranslation();

    const TITLE = t("rides.ride_planning");
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