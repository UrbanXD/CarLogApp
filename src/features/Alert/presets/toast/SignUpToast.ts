import { AlertToastProps } from "../../components/AlertToast";
import { ToastMessages } from "../../constants/constants";

const success: AlertToastProps = {
    type: "success",
    title: "Sikeres regisztráció!"
}

const otp_expired: AlertToastProps = {
    type: "warning",
    body: "Az Ön által megadott kód érvénytelen, esetleg lejárt."
}

const email_exists: AlertToastProps = {
    type: "warning",
    body: "Az Ön által megadott email címmel már regisztráltak!"
}

const error: AlertToastProps = {
    type: "error",
    body: "Váratlan hiba lépett fel a regisztráció során!"
}

const otp_error: AlertToastProps = {
    type: "error",
    body: "Váratlan hiba lépett fel a fiók hitelesítése során!"
}

export const SignUpToast: ToastMessages = {
    success,
    error,
    otp_error,
    otp_expired,
    email_exists
}