import React from "react";
import { useLocalSearchParams } from "expo-router";
import { CreateOdometerChangeLogForm } from "../../components/forms/CreateOdometerChangeLogForm.tsx";
import { useTranslation } from "react-i18next";
import { FormBottomSheet } from "../../../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";

export function CreateOdometerLogBottomSheet() {
    const { t } = useTranslation();
    const { carId } = useLocalSearchParams();

    const TITLE = t("odometer.create");
    const CONTENT = <CreateOdometerChangeLogForm defaultCarId={ carId }/>;

    return (
        <FormBottomSheet
            title={ TITLE }
            content={ CONTENT }
            enableDynamicSizing
        />
    );
}