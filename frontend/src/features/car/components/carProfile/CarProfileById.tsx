import React from "react";
import useCarProfile from "../../hooks/useCarProfile.tsx";
import CarProfileView from "./CarProfileView.tsx";
import { router } from "expo-router";

type CarProfileByIdProps = {
    carId: string
    fuelSliderDisabled?: boolean
}

const CarProfileById: React.FC<CarProfileByIdProps> = ({ carId, fuelSliderDisabled = false }) => {
    const {
        car,
        handleDeleteCar,
        openEditCarStepBottomSheet
    } = useCarProfile(carId);

    if(!car) {
        if(router.canGoBack()) return router.back();
        return router.replace("(main)/index");
    }

    return (
        <CarProfileView
            car={ car }
            handleDeleteCar={ handleDeleteCar }
            fuelSliderDisabled={ fuelSliderDisabled }
            openEditCarStep={ openEditCarStepBottomSheet }
        />
    );
};

export default CarProfileById;