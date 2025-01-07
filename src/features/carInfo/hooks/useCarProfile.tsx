import {useDatabase} from "../../Database/connector/Database";
import {useAlert} from "../../Alert/context/AlertProvider";
import useCars from "../../Shared/hooks/useCars";
import {useBottomSheet} from "../../BottomSheet/context/BottomSheetProvider";
import EditCarForm from "../../Form/layouts/car/editCar/EditCarForm";
import React from "react";
import {ICON_NAMES} from "../../Shared/constants/constants";
import {CAR_FORM_STEPS} from "../../Form/layouts/car/steps/useCarSteps";

const useCarProfile = (carID: string) => {
    const database = useDatabase();
    const { openModal } = useAlert();
    const { openBottomSheet, forceCloseBottomSheet } = useBottomSheet();
    const {
        getCar,
        getCarImage
    } = useCars();

    const car = getCar(carID);
    const carImage = getCarImage(carID)?.image;

    const handleDeleteCar = () => {
        openModal({
            title: `A(z) ${car.name} nevű autó törlése`,
            body: `Az autó kitörlése egy visszafordithatatlan folyamat, gondolja meg jól, hogy folytatja-e a műveletet`,
            acceptText: "Törlés",
            accept: () => {
                // store.dispatch(deleteCar({ database, carID: car.id }));
            },
        })
    }

    const openEditForm = (stepIndex: number, height: string = "37.5%") =>
        openBottomSheet({
            content:
                <EditCarForm
                    car={ car }
                    stepIndex={ stepIndex }
                    forceCloseBottomSheet={ forceCloseBottomSheet }
                />,
            snapPoints: [height]
        })

    const nameInformationBlock = {
        data: [
            {
                icon: ICON_NAMES.nametag,
                text: car?.name
            }
        ],
        onEdit: () => openEditForm(CAR_FORM_STEPS.NameStep)
    };

    const carModelInformationBlock = {
        data: [
            {
                icon: ICON_NAMES.car,
                text: `${car.brand} ${car.model}`
            },
            {
                icon: ICON_NAMES.calendar,
                text: "2025"
            }
        ],
        onEdit: () => openEditForm(CAR_FORM_STEPS.CarModelStep)
    }

    return {
        car,
        carImage,
        handleDeleteCar,
        nameInformationBlock,
        carModelInformationBlock,
    };
}

export default useCarProfile;