import useCars from "./useCars.ts";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { useAppDispatch } from "../../../hooks/index.ts";
import { useAlert } from "../../../ui/alert/hooks/useAlert.ts";
import { deleteCar } from "../model/actions/deleteCar.ts";
import { router } from "expo-router";
import { EDIT_CAR_FORM_STEPS } from "../constants/index.ts";

const useCarProfile = (carId: string) => {
    const dispatch = useAppDispatch();
    const database = useDatabase();
    const { openModal, openToast } = useAlert();
    const { getCar } = useCars();

    const car = getCar(carId);

    const handleDeleteCar = () => {
        if(!car) return openToast({ type: "warning", title: "Autó nem található!" });

        openModal({
            title: `A(z) ${ car.name } nevű autó törlése`,
            body: `Az autó kitörlése egy visszafordithatatlan folyamat, gondolja meg jól, hogy folytatja-e a műveletet`,
            acceptText: "Törlés",
            acceptAction: () => dispatch(deleteCar({ database, carId: car.id }))
        });
    };

    const openEditCarStep = (stepIndex: EDIT_CAR_FORM_STEPS) => {
        if(!car) return openToast({ type: "warning", title: "Autó nem található!" });

        router.push({ pathname: "car/edit/[id]", params: { id: car.id, stepIndex } });
    };

    return { car, handleDeleteCar, openEditCarStep };
};

export default useCarProfile;