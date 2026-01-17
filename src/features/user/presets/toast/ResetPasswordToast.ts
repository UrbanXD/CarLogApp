import { ToastMessage, ToastMessages } from "../../../../ui/alert/model/types/index.ts";
import i18n from "../../../../i18n/index.ts";

const success: ToastMessage = () => {
    return {
        type: "success",
        title: i18n.t("auth.toast.reset_password.success.title")
    };
};

const over_email_send_rate_limit: ToastMessage = (seconds?: string) => {
    return {
        type: "warning",
        title: i18n.t("auth.toast.otp.over_email_send_rate_limit.title"),
        body: i18n.t("auth.toast.otp.over_email_send_rate_limit.body", { seconds: seconds ?? 0 })
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
        body: i18n.t("auth.toast.reset_password.error.body")
    };
};

export const ResetPasswordToast: ToastMessages = {
    success,
    error,
    over_email_send_rate_limit,
    otp_expired
};