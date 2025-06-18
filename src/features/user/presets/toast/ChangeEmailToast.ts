import { ToastMessage, ToastMessages } from "../../../../ui/alert/types/index.ts";

const success: ToastMessage = () => {
    return {
        type: "success",
        title: "Email cím módosítva!"
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
        body: "Váratlan hiba lépett fel az email cím módosítása közben!"
    }
}

export const ChangeEmailToast: ToastMessages = {
    success,
    otp_expired,
    error
}