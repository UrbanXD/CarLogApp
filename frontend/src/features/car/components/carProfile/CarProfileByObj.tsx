import React from "react";
import CarProfileView from "./CarProfileView.tsx";
import { CarTableType } from "../../../../database/connector/powersync/AppSchema.ts";

type CarProfileByObjProps = {
    car: CarTableType
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