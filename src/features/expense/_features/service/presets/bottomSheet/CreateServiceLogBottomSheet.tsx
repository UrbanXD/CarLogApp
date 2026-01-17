import React from "react";
import { CreateServiceLogForm } from "../../components/forms/CreateServiceLogForm.tsx";
import { useTranslation } from "react-i18next";
import { FormBottomSheet } from "../../../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";

export function CreateServiceLogBottomSheet() {
    const { t } = useTranslation();

    return (
        <FormBottomSheet
            title={ t("service.create") }
            content={ <CreateServiceLogForm/> }
        />
    );
}