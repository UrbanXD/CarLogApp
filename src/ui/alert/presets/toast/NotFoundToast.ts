import { ToastMessage, ToastMessages } from "../../model/types/index.ts";
import i18n from "../../../../i18n/index.ts";

const warning: ToastMessage = (name) => {
    return {
        type: "warning",
        body: i18n.t("toast.not_found.body", { name: name ?? i18n.t("common.element") })
    };
};

export const NotFoundToast: ToastMessages = {
    warning
};