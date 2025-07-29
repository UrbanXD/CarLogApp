import React from "react";
import useCarProfile from "../../hooks/useCarProfile.tsx";
import CarProfileView from "./CarProfileView.tsx";

interface CarProfileByIdProps {
    carId: string;
}

const CarProfileById: React.FC<CarProfileByIdProps> = ({ carId }) => {
    const {
        car,
        handleDeleteCar,
        openEditCarStepBottomSheet
    } = useCarProfile(carId);

    return (
        <CarProfileView
            car={ car }
            handleDeleteCar={ handleDeleteCar }
            openEditCarStep={ openEditCarStepBottomSheet }
        />
    );
};

export default CarProfileById;