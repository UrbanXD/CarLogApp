import { ToastMessage, ToastMessages } from "../../../../ui/alert/model/types/index.ts";
import i18n from "../../../../i18n/index.ts";

const success: ToastMessage = () => {
    return {
        type: "success",
        title: i18n.t("auth.toast.delete_user.success.title")
    };
};

const otp_expired: ToastMessage = () => {
    return {
        type: "warning",
        body: i18n.t("auth.toast.otp.expired.body")
    };
};

const error: ToastMessage = () => {
    return {
        type: "error",
        body: i18n.t("auth.toast.delete_user.error.body")
    };
};

export const DeleteUserToast: ToastMessages = {
    success,
    error,
    otp_expired
};