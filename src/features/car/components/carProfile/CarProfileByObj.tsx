import React from "react";
import CarProfileView from "./CarProfileView.tsx";
import { CarTableType } from "../../../../database/connector/powersync/AppSchema.ts";

interface CarProfileByObjProps {
    car: CarTableType;
    carImage?: string;
    goTo?: (stepIndex: number) => void;
}

const CarProfileByObj: React.FC<CarProfileByObjProps> = ({
    car,
    carImage,
    goTo
}) => {
    const openEditCarStep = (stepIndex: number, _?: string) => {
        goTo(stepIndex);
    };

    return (
        <CarProfileView
            car={ car }
            carImage={ carImage }
            openEditCarStep={ openEditCarStep }
        />
    );
};

export default CarProfileByObj;