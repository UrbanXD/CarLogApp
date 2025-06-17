import React from "react";
import useCarProfile from "../../hooks/useCarProfile.tsx";
import CarProfileView from "./CarProfileView.tsx";

interface CarProfileByIdProps {
    carId: string
}

const CarProfileById: React.FC<CarProfileByIdProps> = ({ carId }) => {
    const {
        car,
        carImage,
        handleDeleteCar,
        openEditCarStep
    } = useCarProfile(carId);

    return (
        <CarProfileView
            car={ car }
            carImage={ carImage }
            handleDeleteCar={ handleDeleteCar }
            openEditCarStep={ openEditCarStep }
        />
    )
}

export default CarProfileById;