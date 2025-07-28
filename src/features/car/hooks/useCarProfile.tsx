import useCars from "./useCars.ts";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { useAppDispatch } from "../../../hooks/index.ts";
import { useAlert } from "../../../ui/alert/hooks/useAlert.ts";
import { deleteCar } from "../model/actions/deleteCar.ts";
import { router } from "expo-router";

const useCarProfile = (carID: string) => {
    const dispatch = useAppDispatch();
    const database = useDatabase();
    const { openModal } = useAlert();
    const { getCar } = useCars();

    const car = getCar(carID);

    const handleDeleteCar = () => {
        openModal({
            title: `A(z) ${ car.name } nevű autó törlése`,
            body: `Az autó kitörlése egy visszafordithatatlan folyamat, gondolja meg jól, hogy folytatja-e a műveletet`,
            acceptText: "Törlés",
            acceptAction: () => {
                dispatch(deleteCar({ database, carID: car.id }));
            }
        });
    };

    const openEditCarStepBottomSheet = (stepIndex: number) => {
        router.push({ pathname: "bottomSheet/editCar", params: { carId: car.id, stepIndex } });
    };

    return {
        car,
        handleDeleteCar,
        openEditCarStepBottomSheet
    };
};

export default useCarProfile;