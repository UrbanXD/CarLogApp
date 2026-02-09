import { ToastMessage, ToastMessages } from "../../../../ui/alert/model/types/index.ts";
import i18n from "../../../../i18n/index.ts";

const success: ToastMessage = () => {
    return {
        type: "success",
        body: i18n.t("car.toast.create.success.body")
    };
};

const error: ToastMessage = () => {
    return {
        type: "error",
        body: i18n.t("car.toast.create.error.body")
    };
};

export const CarCreateToast: ToastMessages = {
    success,
    error
};