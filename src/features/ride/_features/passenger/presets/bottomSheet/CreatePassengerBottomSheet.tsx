import React from "react";
import { CreatePassengerForm } from "../../components/forms/CreatePassengerForm.tsx";
import { useTranslation } from "react-i18next";
import { FormBottomSheet } from "../../../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";


export function CreatePassengerBottomSheet() {
    const { t } = useTranslation();

    return (
        <FormBottomSheet
            title={ t("passengers.create") }
            content={ <CreatePassengerForm/> }
            enableDynamicSizing
        />
    );
}