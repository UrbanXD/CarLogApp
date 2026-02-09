import { ToastMessage, ToastMessages } from "../../../../ui/alert/model/types/index.ts";
import i18n from "../../../../i18n/index.ts";

const success: ToastMessage = () => {
    return {
        type: "success",
        title: i18n.t("auth.toast.add_password.success.title")
    };
};

const error: ToastMessage = () => {
    return {
        type: "error",
        body: i18n.t("auth.toast.add_password.error.body")
    };
};

export const AddPasswordToast: ToastMessages = {
    success,
    error
};