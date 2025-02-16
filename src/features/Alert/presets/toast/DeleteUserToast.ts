import { ToastMessages } from "../../constants/constants.ts";
import { AlertToastProps } from "../../components/AlertToast.tsx";

const success: AlertToastProps = {
    type: "success",
    title: "Felhasználó törölve!"
}

const otp_expired: AlertToastProps = {
    type: "warning",
    body: "Az Ön által megadott kód érvénytelen, esetleg lejárt."
}

const error: AlertToastProps = {
    type: "error",
    body: "Váratlan hiba lépett fel a felhasználói fiók törlése közben!"
}

export const DeleteUserToast: ToastMessages = {
    success,
    error,
    otp_expired
}