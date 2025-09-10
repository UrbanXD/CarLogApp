import React from "react";
import CarProfileView from "./CarProfileView.tsx";
import { Car } from "../../schemas/carSchema.ts";

type CarProfileByObjProps = {
    car: Car
    goTo?: (stepIndex: number) => void
    fuelSliderDisabled?: boolean
}

const CarProfileByObj: React.FC<CarProfileByObjProps> = ({
    car,
    goTo,
    fuelSliderDisabled = false
}) => {
    const openEditCarStep = (stepIndex: number) => {
        goTo(stepIndex);
    };

    return (
        <CarProfileView
            car={ car }
            openEditCarStep={ openEditCarStep }
            fuelSliderDisabled={ fuelSliderDisabled }
        />
    );
};

export default CarProfileByObj;