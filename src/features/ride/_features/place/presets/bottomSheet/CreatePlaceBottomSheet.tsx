import React from "react";
import { CreatePlaceForm } from "../../components/forms/CreatePlaceForm.tsx";
import { useTranslation } from "react-i18next";
import { FormBottomSheet } from "../../../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";

export function CreatePlaceBottomSheet() {
    const { t } = useTranslation();

    return (
        <FormBottomSheet
            title={ t("places.create") }
            content={ <CreatePlaceForm/> }
            enableDynamicSizing
        />
    );
}