import React, { useEffect } from "react";
import { EditCarForm } from "../../components/forms/EditCarForm.tsx";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { FormBottomSheet } from "../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";
import { router, useLocalSearchParams } from "expo-router";
import { useCar } from "../../hooks/useCar.ts";
import { EDIT_CAR_FORM_STEPS } from "../../constants";

export function CarEditBottomSheet() {
    const { id, stepIndex } = useLocalSearchParams<{ id?: string, stepIndex?: string }>();
    const { car, isLoading } = useCar({ carId: id });

    const fieldIndex = stepIndex ? Number(stepIndex) : NaN;
    const isValidField = !isNaN(fieldIndex) && fieldIndex in EDIT_CAR_FORM_STEPS;

    useEffect(() => {
        if(isValidField && (car || isLoading)) return;

        if(router.canGoBack()) return router.back();
        router.replace("(main)/index");
    }, [car, isLoading, isValidField]);


    if(!isValidField) return null;

    const CONTENT = car ? <EditCarForm car={ car } stepIndex={ fieldIndex }/> : null;
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