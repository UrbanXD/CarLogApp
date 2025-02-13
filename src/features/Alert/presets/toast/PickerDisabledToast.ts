import { AlertToastProps } from "../../components/AlertToast";
import {ToastMessages} from "../../constants/constants.ts";

const warning = (disabledText?: string) => {
    return {
        type: "warning",
        body: disabledText
    } as AlertToastProps
}

export const PickerDisabledToast: ToastMessages = {
    warning
}