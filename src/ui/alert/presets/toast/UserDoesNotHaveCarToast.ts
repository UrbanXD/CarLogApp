import { ToastMessage, ToastMessages } from "../../model/types/index.ts";
import i18n from "../../../../i18n/index.ts";

const info: ToastMessage = () => {
    return {
        type: "info",
        body: i18n.t("toast.user_does_not_have_car.body")
    };
};

export const UserDoesNotHaveCarToast: ToastMessages = {
    info
};