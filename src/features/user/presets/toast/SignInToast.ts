import { ToastMessage, ToastMessages } from "../../../../ui/alert/model/types/index.ts";
import i18n from "../../../../i18n/index.ts";

const success: ToastMessage = () => {
    return {
        type: "success",
        title: i18n.t("auth.toast.sign_in.success.title")
    };
};

const error: ToastMessage = () => {
    return {
        type: "error",
        body: i18n.t("auth.toast.sign_in.error.body")
    };
};

const invalid_credentials: ToastMessage = () => {
    return {
        type: "warning",
        body: i18n.t("auth.toast.sign_in.invalid_credentials.body")
    };
};

export const SignInToast: ToastMessages = {
    success,
    error,
    invalid_credentials
};