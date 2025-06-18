import { ToastMessage, ToastMessages } from "../../../../ui/alert/types/index.ts";

const error: ToastMessage = () => {
    return {
        type: "error",
        body: "Váratlan hiba lépetett fel a Google autentikáció közben!"
    }
}

const auth_flow_cancelled: ToastMessage = () => {
    return {
        type: "warning",
        body: "Megszakította a Google autentikáció folyamatát!"
    }
}

const ASYNC_OP_IN_PROGRESS: ToastMessage = () => {
    return {
        type: "warning",
        body: "Még folyamatban van egy Google autentikáció, várjon egy kicsit!"
    }
}

export const GoogleAuthToast: ToastMessages = {
    error,
    "12501": auth_flow_cancelled,
    ASYNC_OP_IN_PROGRESS
}