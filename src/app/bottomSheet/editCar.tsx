import React from "react";
import { useLocalSearchParams } from "expo-router";
import EditCarBottomSheet from "../../features/car/presets/bottomSheet/CarEditBottomSheet.tsx";
import useCars from "../../features/car/hooks/useCars.ts";

const Page: React.FC = () => {
    const { carId, stepIndex } = useLocalSearchParams<{ carId: string, stepIndex: number }>();
    const { getCar } = useCars();

    const car = getCar(carId);
    return (
        <EditCarBottomSheet car={ car } stepIndex={ stepIndex }/>
    );
};

export default Page;
