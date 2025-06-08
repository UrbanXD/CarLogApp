import { useDatabase } from "../../Database/connector/Database";
import { useAlert } from "../../Alert/context/AlertProvider";
import useCars from "../../../hooks/useCars";
import { useBottomSheet } from "../../BottomSheet/context/BottomSheetContext.ts";
import EditCarForm from "../../Form/layouts/car/editCar/EditCarForm";
import React from "react";
import { store } from "../../Database/redux/store";
import { deleteCar } from "../../Database/redux/cars/functions/deleteCar";

const useCarProfile = (carID: string) => {
    const database = useDatabase();
    const { openModal } = useAlert();
    const { openBottomSheet, dismissBottomSheet } = useBottomSheet();
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

    const openEditForm = (stepIndex: number, height: string = "50%") =>
        openBottomSheet({
            content:
                <EditCarForm
                    car={ car }
                    carImage={ carImage }
                    stepIndex={ stepIndex }
                    dismissBottomSheet={ dismissBottomSheet }
                />,
            snapPoints: [height],
            enableDismissOnClose: false
        })

    return {
        openEditForm,
        car,
        carImage,
        handleDeleteCar
    };
}

export default useCarProfile;