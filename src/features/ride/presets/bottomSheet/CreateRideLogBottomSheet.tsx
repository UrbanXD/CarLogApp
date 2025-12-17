import React from "react";
import { CreateRideLogForm } from "../../components/forms/CreateRideLogForm.tsx";
import { useTranslation } from "react-i18next";
import { FormBottomSheet } from "../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";

export function CreateRideLogBottomSheet() {
    const { t } = useTranslation();

    return (
        <FormBottomSheet
            title={ t("rides.ride_planning") }
            content={ <CreateRideLogForm/> }
        />
    );
}