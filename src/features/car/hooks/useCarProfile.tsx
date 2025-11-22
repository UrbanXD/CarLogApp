import useCars from "./useCars.ts";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { useAppDispatch } from "../../../hooks/index.ts";
import { useAlert } from "../../../ui/alert/hooks/useAlert.ts";
import { deleteCar } from "../model/actions/deleteCar.ts";
import { router } from "expo-router";
import { EDIT_CAR_FORM_STEPS } from "../constants/index.ts";
import { useTranslation } from "react-i18next";
import { NotFoundToast } from "../../../ui/alert/presets/toast/index.ts";
import { DeleteModal } from "../../../ui/alert/presets/modal/index.ts";

const useCarProfile = (carId: string) => {
    const dispatch = useAppDispatch();
    const database = useDatabase();
    const { t } = useTranslation();
    const { openModal, openToast } = useAlert();
    const { getCar } = useCars();

    const car = getCar(carId);

    const handleDeleteCar = () => {
        if(!car) return openToast(NotFoundToast.warning(t("car.text")));

        openModal(DeleteModal({
            name: t("car.car_name", { name: car.name }),
            acceptAction: () => dispatch(deleteCar({ database, carId: car.id }))
        }));
    };

    const openEditCarStep = (stepIndex: EDIT_CAR_FORM_STEPS) => {
        if(!car) return openToast(NotFoundToast.warning(t("car.text")));

        router.push({ pathname: "car/edit/[id]", params: { id: car.id, stepIndex } });
    };

    return { car, handleDeleteCar, openEditCarStep };
};

export default useCarProfile;