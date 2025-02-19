import { ToastMessage, ToastMessages } from "../../constants/constants.ts";

const success: ToastMessage = () => {
    return {
        type: "success",
        title: "Név módosítva!"
    }
}

const error: ToastMessage = () => {
    return {
        type: "error",
        body: "Váratlan hiba lépett fel a név módosítása közben!"
    }
}

export const ChangeNameToast: ToastMessages = {
    success,
    error
}