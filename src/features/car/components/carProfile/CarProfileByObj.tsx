import React from "react";
import CarProfileView from "./CarProfileView.tsx";
import { CarTableType } from "../../../../database/connector/powersync/AppSchema.ts";

type CarProfileByObjProps = {
    car: CarTableType
    goTo?: (stepIndex: number) => void
}

const CarProfileByObj: React.FC<CarProfileByObjProps> = ({
    car,
    goTo
}) => {
    const openEditCarStep = (stepIndex: number) => {
        goTo(stepIndex);
    };

    return (
        <CarProfileView
            car={ car }
            openEditCarStep={ openEditCarStep }
        />
    );
};

export default CarProfileByObj;