import i18n from "../../../../i18n/index.ts";
import { ToastMessage, ToastMessages } from "../../model/types/index.ts";

const limit: ToastMessage = () => {
    return {
        type: "warning",
        body: i18n.t("toast.array_input.limit.body")
    };
};

const alreadyAdded: ToastMessage = () => {
    return {
        type: "warning",
        body: i18n.t("toast.array_input.already_added.body")
    };
};

const error: ToastMessage = (action) => {
    return {
        type: "error",
        body: i18n.t("toast.array_input.error.body", { action: action })
    };
};

export const ArrayInputToast: ToastMessages = {
    limit,
    alreadyAdded,
    error
};