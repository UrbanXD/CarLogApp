import { ToastMessage, ToastMessages } from "../../model/types/index.ts";
import i18n from "../../../../i18n/index.ts";

const warning: ToastMessage = (disabledText?: string) => {
    return {
        type: "warning",
        body: disabledText || i18n.t("toast.picker_disabled.default_body")
    };
};

export const PickerDisabledToast: ToastMessages = {
    warning
};