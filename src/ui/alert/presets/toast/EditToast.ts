import i18n from "../../../../i18n/index.ts";
import { ToastMessage, ToastMessages } from "../../model/types/index.ts";

const success: ToastMessage = () => {
    return {
        type: "success",
        body: i18n.t("toast.edit.success.body")
    };
};

const error: ToastMessage = () => {
    return {
        type: "error",
        body: i18n.t("toast.edit.error.body")
    };
};

export const EditToast: ToastMessages = {
    success,
    error
};