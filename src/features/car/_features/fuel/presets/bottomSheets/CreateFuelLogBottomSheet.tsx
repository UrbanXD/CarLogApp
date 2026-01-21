import React from "react";
import { CreateFuelLogForm } from "../../components/forms/CreateFuelLogForm.tsx";
import { useTranslation } from "react-i18next";
import { FormBottomSheet } from "../../../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";
import { useCar } from "../../../../hooks/useCar.ts";

export function CreateFuelLogBottomSheet() {
    const { t } = useTranslation();
    const { car, isLoading } = useCar({ options: { queryOnce: true } });

    const TITLE = t("fuel.create");
    const CONTENT = <CreateFuelLogForm car={ car }/>;

    return (
        <FormBottomSheet
            title={ TITLE }
            content={ CONTENT }
            enableDynamicSizing={ false }
            isLoading={ isLoading }
        />
    );
}