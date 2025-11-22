import i18n from "../../../../i18n/index.ts";
import { ToastMessage, ToastMessages } from "../../model/types/index.ts";

const success: ToastMessage = (name) => {
    return {
        type: "success",
        body: i18n.t("toast.create.success.body", { name: name ?? i18n.t("common.element") })
    };
};

const error: ToastMessage = (name) => {
    return {
        type: "error",
        body: i18n.t("toast.create.error.body", { name: name ?? i18n.t("common.element") })
    };
};

export const CreateToast: ToastMessages = {
    success,
    error
};