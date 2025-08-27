import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import EditCarBottomSheet from "../../features/car/presets/bottomSheet/CarEditBottomSheet.tsx";
import useCars from "../../features/car/hooks/useCars.ts";

const Page: React.FC = () => {
    const { carId, stepIndex } = useLocalSearchParams();
    const { getCar } = useCars();

    const car = getCar(carId);

    if(!car) {
        if(router.canGoBack()) return router.back();
        router.replace("(main)/index");
    }

    return (
        <EditCarBottomSheet car={ car } stepIndex={ stepIndex }/>
    );
};

export default Page;
