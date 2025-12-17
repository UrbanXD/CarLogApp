import React from "react";
import { CreateFuelLogForm } from "../../components/forms/CreateFuelLogForm.tsx";
import { useTranslation } from "react-i18next";
import { FormBottomSheet } from "../../../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";

export function CreateFuelLogBottomSheet() {
    const { t } = useTranslation();

    const TITLE = t("fuel.create");
    const CONTENT = <CreateFuelLogForm/>;

    return (
        <FormBottomSheet
            title={ TITLE }
            content={ CONTENT }
            enableDynamicSizing={ false }
        />
    );
}