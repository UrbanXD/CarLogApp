import React from "react";
import { CreateRideLogForm } from "../../components/forms/CreateRideLogForm.tsx";
import { useTranslation } from "react-i18next";
import { FormBottomSheet } from "../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";
import { useAppSelector } from "../../../../hooks";
import { getSelectedCarId } from "../../../car/model/selectors/getSelectedCarId.ts";
import { useCar } from "../../../car/hooks/useCar.ts";

export function CreateRideLogBottomSheet() {
    const { t } = useTranslation();
    const selectedCarId = useAppSelector(getSelectedCarId);
    const { car, isLoading } = useCar({ carId: selectedCarId, options: { queryOnce: true } });

    return (
        <FormBottomSheet
            title={ t("rides.ride_planning") }
            content={ <CreateRideLogForm car={ car }/> }
            isLoading={ isLoading }
        />
    );
}