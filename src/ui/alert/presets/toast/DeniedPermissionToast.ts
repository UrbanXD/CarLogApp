import { ToastMessage, ToastMessages } from "../../model/types/index.ts";
import i18n from "../../../../i18n/index.ts";

const error: ToastMessage = (permission) => {
    return {
        type: "error",
        body: i18n.t("toast.denied_permission.body", { permission: permission ?? i18n.t("permission.title") })
    };
};

export const DeniedPermissionToast: ToastMessages = {
    error
};