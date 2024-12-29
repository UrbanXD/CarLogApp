import {AlertToastProps} from "../../components/AlertToast";

const warning = (disabledText?: string) => {
    return {
        type: "warning",
        body: disabledText
    } as AlertToastProps
}

export default {
    warning
}