import React from "react";
import { CreateFuelLogForm } from "../../components/forms/CreateFuelLogForm.tsx";
import { useTranslation } from "react-i18next";
import { FormBottomSheet } from "../../../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";
import { useCar } from "../../../../hooks/useCar.ts";
import { useAppSelector } from "../../../../../../hooks";
import { getSelectedCarId } from "../../../../model/selectors/getSelectedCarId.ts";

export function CreateFuelLogBottomSheet() {
    const { t } = useTranslation();
    const selectedCarId = useAppSelector(getSelectedCarId);
    const { car, isLoading } = useCar({ carId: selectedCarId, options: { queryOnce: true } });

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