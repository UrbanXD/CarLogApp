import React, { useEffect } from "react";
import { useCarProfile } from "../../hooks/useCarProfile.tsx";
import CarProfileView from "./CarProfileView.tsx";
import { router } from "expo-router";
import { MoreDataLoading } from "../../../../components/loading/MoreDataLoading.tsx";

type CarProfileByIdProps = {
    carId: string
    fuelSliderDisabled?: boolean
}

const CarProfileById: React.FC<CarProfileByIdProps> = ({ carId, fuelSliderDisabled = false }) => {
    const { car, isLoading, handleDeleteCar, openEditCarStep } = useCarProfile(carId);

    useEffect(() => {
        if(car || isLoading) return;

        if(router.canGoBack()) return router.back();
        return router.replace("(main)/index");
    }, [car]);

    const openOdometerLog = () => router.push({ pathname: "/odometer/log", params: { id: carId } });

    if(!car || isLoading) return <MoreDataLoading/>;

    return (
        <CarProfileView
            car={ car }
            handleDeleteCar={ handleDeleteCar }
            openEditCarStep={ openEditCarStep }
            openOdometerLog={ openOdometerLog }
        />
    );
};

export default CarProfileById;