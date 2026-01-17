import React, { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import useCars from "../../../features/car/hooks/useCars.ts";
import CarEditBottomSheet from "../../../features/car/presets/bottomSheet/CarEditBottomSheet.tsx";
import { EDIT_CAR_FORM_STEPS } from "../../../features/car/constants/index.ts";

function Page() {
    const { id, stepIndex } = useLocalSearchParams<{ id?: string, stepIndex?: string }>();
    const { getCar } = useCars();

    const car = getCar(id);

    useEffect(() => {
        if(car) return;

        if(router.canGoBack()) return router.back();
        router.replace("(main)/index");
    }, [car]);

    const fieldIndex = stepIndex ? Number(stepIndex) : NaN;
    const isValidField = !isNaN(fieldIndex) && fieldIndex in EDIT_CAR_FORM_STEPS;
    if(!car || !isValidField) return <></>;

    return (
        <CarEditBottomSheet
            car={ car }
            stepIndex={ fieldIndex }
        />
    );
}

export default Page;