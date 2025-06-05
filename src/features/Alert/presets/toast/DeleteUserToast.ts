import { ToastMessage, ToastMessages } from "../../constants/types.ts";

const success: ToastMessage = () => {
    return {
        type: "success",
        title: "Felhasználó törölve!"
    }
}

const otp_expired: ToastMessage = () => {
    return {
        type: "warning",
        body: "Az Ön által megadott kód érvénytelen, esetleg lejárt."
    }
}

const error: ToastMessage = () => {
    return {
        type: "error",
        body: "Váratlan hiba lépett fel a felhasználói fiók törlése közben!"
    }
}

export const DeleteUserToast: ToastMessages = {
    success,
    error,
    otp_expired
}