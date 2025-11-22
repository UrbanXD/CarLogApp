import { ToastMessage, ToastMessages } from "../../../../ui/alert/model/types/index.ts";
import i18n from "../../../../i18n/index.ts";

const success: ToastMessage = () => {
    return {
        type: "success",
        title: i18n.t("auth.toast.sign_up.success.title")
    };
};

const otp_expired: ToastMessage = () => {
    return {
        type: "warning",
        body: i18n.t("auth.toast.otp.expired.body")
    };
};

const email_exists: ToastMessage = () => {
    return {
        type: "warning",
        body: i18n.t("auth.toast.sign_up.email_exists.body")
    };
};

const error: ToastMessage = () => {
    return {
        type: "error",
        body: i18n.t("auth.toast.sign_up.error.body")
    };
};

const otp_error: ToastMessage = () => {
    return {
        type: "error",
        body: i18n.t("auth.toast.sign_up.otp_error.body")
    };
};

export const SignUpToast: ToastMessages = {
    success,
    error,
    otp_error,
    otp_expired,
    email_exists
};