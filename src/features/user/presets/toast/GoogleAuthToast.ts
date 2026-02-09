import { ToastMessage, ToastMessages } from "../../../../ui/alert/model/types/index.ts";
import i18n from "../../../../i18n/index.ts";

const error: ToastMessage = () => {
    return {
        type: "error",
        body: i18n.t("auth.toast.google.error.body")
    };
};

const auth_flow_cancelled: ToastMessage = () => {
    return {
        type: "warning",
        body: i18n.t("auth.toast.google.auth_flow_cancelled.body")
    };
};

const ASYNC_OP_IN_PROGRESS: ToastMessage = () => {
    return {
        type: "warning",
        body: i18n.t("auth.toast.google.already_in_progress.body")
    };
};

export const GoogleAuthToast: ToastMessages = {
    error,
    "12501": auth_flow_cancelled,
    ASYNC_OP_IN_PROGRESS
};