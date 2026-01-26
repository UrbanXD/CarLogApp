import React from "react";
import { EditCarForm } from "../../components/forms/EditCarForm.tsx";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { FormBottomSheet } from "../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";
import { useLocalSearchParams } from "expo-router";
import { useCar } from "../../hooks/useCar.ts";
import { EDIT_CAR_FORM_STEPS } from "../../constants";
import { useTranslation } from "react-i18next";
import { useFormBottomSheetGuard } from "../../../../hooks/useFormBottomSheetGuard.ts";

export function CarEditBottomSheet() {
    const { id, stepIndex } = useLocalSearchParams<{ id?: string, stepIndex?: string }>();
    const { t } = useTranslation();
    const { car, isLoading } = useCar({ carId: id });

    const { fieldValue, isValidField } = useFormBottomSheetGuard({
        data: car,
        isLoading,
        field: stepIndex,
        enumObject: EDIT_CAR_FORM_STEPS,
        notFoundText: t("fuel.log")
    });

    if(!isValidField) return null;

    const CONTENT = car ? <EditCarForm car={ car } stepIndex={ fieldValue }/> : null;
    const MAX_DYNAMIC_CONTENT_SIZE = heightPercentageToDP(85);

    return (
        <FormBottomSheet
            content={ CONTENT }
            maxDynamicContentSize={ MAX_DYNAMIC_CONTENT_SIZE }
            enableDynamicSizing
            enableDismissOnClose={ false }
            isLoading={ isLoading }
        />
    );
}