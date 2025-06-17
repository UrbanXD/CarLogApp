import { useDatabase } from "../../Database/connector/Database.ts";
import { useAlert } from "../../Alert/context/AlertProvider.tsx";
import useCars from "../../../hooks/useCars.ts";
import { useBottomSheet } from "../../BottomSheet/context/BottomSheetContext.ts";
import EditCarForm from "../components/forms/EditCarForm.tsx";
import React from "react";
import { store } from "../../Database/redux/store.ts";
import { deleteCar } from "../../Database/redux/cars/functions/deleteCar.ts";

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