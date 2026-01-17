import React, { useEffect } from "react";
import useCarProfile from "../../hooks/useCarProfile.tsx";
import CarProfileView from "./CarProfileView.tsx";
import { router } from "expo-router";

type CarProfileByIdProps = {
    carId: string
    fuelSliderDisabled?: boolean
}

const CarProfileById: React.FC<CarProfileByIdProps> = ({ carId, fuelSliderDisabled = false }) => {
    const { car, handleDeleteCar, openEditCarStep } = useCarProfile(carId);

    useEffect(() => {
        if(car) return;

        if(router.canGoBack()) return router.back();
        return router.replace("(main)/index");
    }, [car]);

    const openOdometerLog = () => router.push({ pathname: "/odometer/log", params: { id: carId } });

    if(!car) return null;

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