import { useDatabase } from "../../Database/connector/Database";
import { useAlert } from "../../Alert/context/AlertProvider";
import useCars from "../../Shared/hooks/useCars";
import { useBottomSheet } from "../../BottomSheet/context/BottomSheetProvider";
import EditCarForm from "../../Form/layouts/car/editCar/EditCarForm";
import React from "react";
import { ICON_NAMES } from "../../Shared/constants/constants";
import { CAR_FORM_STEPS } from "../../Form/layouts/car/steps/useCarSteps";
import { store } from "../../Database/redux/store";
import { deleteCar } from "../../Database/redux/cars/functions/deleteCar";

const useCarProfile = (carID: string) => {
    const database = useDatabase();
    const { openModal } = useAlert();
    const { openBottomSheet, forceCloseBottomSheet } = useBottomSheet();
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
                    forceCloseBottomSheet={ forceCloseBottomSheet }
                />,
            snapPoints: [height],
            enableDismissOnClose: false
        })

    const nameInformationBlock = {
        data: [{
                icon: ICON_NAMES.nametag,
                text: car?.name
        }],
        onEdit: () => openEditForm(CAR_FORM_STEPS.NameStep, "37.5%")
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

    const odometerInformationBlock = {
        data: [{
            icon: ICON_NAMES.odometer,
            text: `${car.odometerValue} ${car.odometerMeasurement}`
        }],
        onEdit: () => openEditForm(CAR_FORM_STEPS.OdometerStep)
    }

    const fuelInformationBlock = {
        data: [
            {
                icon: ICON_NAMES.fuel,
                text: car.fuelType
            },
            {
                icon: ICON_NAMES.fuelTank,
                text: `${car.fuelTankSize} ${car.fuelMeasurement}`
            }
        ],
        onEdit: () => openEditForm(CAR_FORM_STEPS.FuelStep, "55%")
    }

    return {
        openEditForm,
        car,
        carImage,
        handleDeleteCar,
        nameInformationBlock,
        carModelInformationBlock,
        odometerInformationBlock,
        fuelInformationBlock
    };
}

export default useCarProfile;