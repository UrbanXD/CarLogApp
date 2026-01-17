import { CreateCarForm } from "../../components/forms/CreateCarForm.tsx";
import React from "react";
import { useTranslation } from "react-i18next";
import { FormBottomSheet } from "../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";

export function CreateCarBottomSheet() {
    const { t } = useTranslation();

    return (
        <FormBottomSheet
            title={ t("car.create") }
            content={ <CreateCarForm/> }
        />
    );
}