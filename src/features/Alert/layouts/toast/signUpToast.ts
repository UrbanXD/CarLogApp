import { AlertToastProps } from "../../components/AlertToast";
import { ToastMessages } from "../../constants/constants";

const success: AlertToastProps = {
    type: "success",
    title: "Sikeres regisztráció!"
}

const otp_expired: AlertToastProps = {
    type: "error",
    body: "Az Ön által megadott kód érvénytelen, esetleg lejárt."
}

const error: AlertToastProps = {
    type: "error",
    body: "Váratlan hiba lépett fel a regisztráció során!"
}

const otp_error: AlertToastProps = {
    type: "error",
    body: "Váratlan hiba lépett fel a fiók hitelesítése során!"
}

export default {
    success,
    error,
    otp_error,
    otp_expired
} as ToastMessages