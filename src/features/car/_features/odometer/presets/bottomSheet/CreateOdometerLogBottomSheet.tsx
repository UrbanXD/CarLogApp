import React from "react";
import { useLocalSearchParams } from "expo-router";
import { CreateOdometerChangeLogForm } from "../../components/forms/CreateOdometerChangeLogForm.tsx";
import { useTranslation } from "react-i18next";
import { FormBottomSheet } from "../../../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";
import { useCar } from "../../../../hooks/useCar.ts";

export function CreateOdometerLogBottomSheet() {
    const { t } = useTranslation();
    const { carId } = useLocalSearchParams<{ carId?: string }>();
    const { car, isLoading } = useCar({ carId: carId, options: { queryOnce: true } });

    const TITLE = t("odometer.create");
    const CONTENT = <CreateOdometerChangeLogForm defaultCar={ car }/>;

    return (
        <FormBottomSheet
            title={ TITLE }
            content={ CONTENT }
            enableDynamicSizing
            isLoading={ isLoading }
        />
    );
}