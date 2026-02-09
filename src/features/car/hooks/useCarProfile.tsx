import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../ui/alert/hooks/useAlert.ts";
import { router } from "expo-router";
import { EDIT_CAR_FORM_STEPS } from "../constants";
import { useTranslation } from "react-i18next";
import { NotFoundToast } from "../../../ui/alert/presets/toast";
import { DeleteModal } from "../../../ui/alert/presets/modal";
import { useCar } from "./useCar.ts";

export function useCarProfile(carId: string) {
    const { carDao } = useDatabase();
    const { t } = useTranslation();
    const { openModal, openToast } = useAlert();
    const { car, isLoading } = useCar({ carId });

    const handleDeleteCar = () => {
        if(!car) return openToast(NotFoundToast.warning(t("car.text")));

        openModal(DeleteModal({
            name: t("car.car_name", { name: car.name }),
            acceptAction: async () => { await carDao.delete(car.id); }
        }));
    };

    const openEditCarStep = (stepIndex: EDIT_CAR_FORM_STEPS) => {
        if(!car) return openToast(NotFoundToast.warning(t("car.text")));

        router.push({ pathname: "car/edit/[id]", params: { id: car.id, stepIndex } });
    };

    return { car, isLoading, handleDeleteCar, openEditCarStep };
}