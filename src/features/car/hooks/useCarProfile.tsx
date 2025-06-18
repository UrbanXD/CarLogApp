import React from "react";
import { useAlert } from "../../Alert/context/AlertProvider.tsx";
import useCars from "./useCars.ts";
import { useBottomSheet } from "../../../contexts/BottomSheet/BottomSheetContext.ts";
import EditCarForm from "../components/forms/EditCarForm.tsx";
import { useDatabase } from "../../../database/connector/Database.ts";
import { store } from "../../../database/redux/store.ts";
import { deleteCar } from "../../../database/redux/car/actions/deleteCar.ts";

const useCarProfile = (carID: string) => {
    const database = useDatabase();
    const { openModal } = useAlert();
    const { openBottomSheet } = useBottomSheet();
    const { getCar, getCarImage } = useCars();

    const car = getCar(carID);
    const carImage = getCarImage(carID)?.image;

    const handleDeleteCar = () => {
        openModal({
            title: `A(z) ${car.name} nevű autó törlése`,
            body: `Az autó kitörlése egy visszafordithatatlan folyamat, gondolja meg jól, hogy folytatja-e a műveletet`,
            acceptText: "Törlés",
            accept: () => {
                store.dispatch(deleteCar({ database, carID: car.id }));
            },
        })
    }

    const openEditCarStep = (stepIndex: number, height: string = "50%") =>
        openBottomSheet({
            content:
                <EditCarForm
                    car={ car }
                    carImage={ carImage }
                    stepIndex={ stepIndex }
                />,
            snapPoints: [height],
            enableDismissOnClose: false
        })

    return {
        car,
        carImage,
        handleDeleteCar,
        openEditCarStep
    };
}

export default useCarProfile;