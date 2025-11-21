import useCars from "./useCars.ts";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { useAppDispatch } from "../../../hooks/index.ts";
import { useAlert } from "../../../ui/alert/hooks/useAlert.ts";
import { deleteCar } from "../model/actions/deleteCar.ts";
import { router } from "expo-router";
import { EDIT_CAR_FORM_STEPS } from "../constants/index.ts";
import { useTranslation } from "react-i18next";

const useCarProfile = (carId: string) => {
    const dispatch = useAppDispatch();
    const database = useDatabase();
    const { t } = useTranslation();
    const { openModal, openToast } = useAlert();
    const { getCar } = useCars();

    const car = getCar(carId);

    const handleDeleteCar = () => {
        if(!car) return openToast({ type: "warning", title: t("modal.not_found", { name: t("car.text") }) });

        openModal({
            title: t("car.modal.delete.title", { name: car.name }),
            body: t("car.modal.delete.body"),
            acceptText: t("form_button.delete"),
            acceptAction: () => dispatch(deleteCar({ database, carId: car.id }))
        });
    };

    const openEditCarStep = (stepIndex: EDIT_CAR_FORM_STEPS) => {
        if(!car) return openToast({ type: "warning", title: t("modal.not_found", { name: t("car.text") }) });

        router.push({ pathname: "car/edit/[id]", params: { id: car.id, stepIndex } });
    };

    return { car, handleDeleteCar, openEditCarStep };
};

export default useCarProfile;