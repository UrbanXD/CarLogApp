import { ToastMessage, ToastMessages } from "../../model/types/index.ts";
import i18n from "../../../../i18n/index.ts";

const warning: ToastMessage = () => {
    return {
        type: "warning",
        title: i18n.t("toast.invalid_form.title"),
        body: i18n.t("toast.invalid_form.body")
    };
};

export const InvalidFormToast: ToastMessages = {
    warning
};