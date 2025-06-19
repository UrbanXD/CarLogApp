import { useAlert } from "../../../ui/alert/contexts/AlertProvider.tsx";
import useCars from "./useCars.ts";
import { useBottomSheet } from "../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useDatabase } from "../../../database/connector/Database.ts";
import { deleteCar } from "../model/actions/deleteCar.ts";
import { CarEditBottomSheet } from "../presets/bottomSheet/index.ts";
import {useAppDispatch} from "../../../hooks/index.ts";

const useCarProfile = (carID: string) => {
    const dispatch = useAppDispatch();
    const database = useDatabase();
    const { openModal } = useAlert();
    const { openBottomSheet } = useBottomSheet();
    const { getCar } = useCars();

    const car = getCar(carID);

    const handleDeleteCar = () => {
        openModal({
            title: `A(z) ${car.name} nevű autó törlése`,
            body: `Az autó kitörlése egy visszafordithatatlan folyamat, gondolja meg jól, hogy folytatja-e a műveletet`,
            acceptText: "Törlés",
            accept: () => {
                dispatch(deleteCar({ database, carID: car.id }));
            },
        })
    }

    const openEditCarStep = (stepIndex: number, height: string = "50%") =>
        openBottomSheet(CarEditBottomSheet({
            car,
            stepIndex,
            height
        }))

    return {
        car,
        handleDeleteCar,
        openEditCarStep
    };
}

export default useCarProfile;