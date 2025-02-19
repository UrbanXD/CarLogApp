import { ToastMessage, ToastMessages } from "../../constants/constants.ts";

const warning: ToastMessage = (disabledText?: string) => {
    return {
        type: "warning",
        body: disabledText || "Nem lehetséges művelet! Valami kimaradt."
    }
}

export const PickerDisabledToast: ToastMessages = {
    warning
}