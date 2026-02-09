import React from "react";
import { CreateExpenseForm } from "../../components/forms/CreateExpenseForm.tsx";
import { useTranslation } from "react-i18next";
import { FormBottomSheet } from "../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";
import { useAppSelector } from "../../../../hooks";
import { getSelectedCarId } from "../../../car/model/selectors/getSelectedCarId.ts";
import { useCar } from "../../../car/hooks/useCar.ts";

export function CreateExpenseBottomSheet() {
    const { t } = useTranslation();
    const selectedCarId = useAppSelector(getSelectedCarId);
    const { car, isLoading } = useCar({ carId: selectedCarId, options: { queryOnce: true } });

    return (
        <FormBottomSheet
            title={ t("expenses.create") }
            content={ <CreateExpenseForm car={ car }/> }
            isLoading={ isLoading }
        />
    );
}