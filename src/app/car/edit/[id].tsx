import React, { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import useCars from "../../../features/car/hooks/useCars.ts";
import CarEditBottomSheet from "../../../features/car/presets/bottomSheet/CarEditBottomSheet.tsx";

function Page() {
    const { id, stepIndex } = useLocalSearchParams();
    const { getCar } = useCars();

    const car = getCar(id);

    useEffect(() => {
        if(car) return;

        if(router.canGoBack()) return router.back();
        router.replace("(main)/index");
    }, [car]);

    if(!car) return <></>;

    return (
        <CarEditBottomSheet
            car={ car }
            stepIndex={ stepIndex }
        />
    );
}

export default Page;