import { ToastMessage, ToastMessages } from "../../../../ui/alert/types/index.ts";

const success: ToastMessage = () => {
    return {
        type: "success",
        title: "Sikeres regisztráció!"
    }
}

const otp_expired: ToastMessage = () => {
    return {
        type: "warning",
        body: "Az Ön által megadott kód érvénytelen, esetleg lejárt."
    }
}

const email_exists: ToastMessage = () => {
    return {
        type: "warning",
        body: "Az Ön által megadott email címmel már regisztráltak!"
    }
}

const error: ToastMessage = () => {
    return {
        type: "error",
        body: "Váratlan hiba lépett fel a regisztráció során!"
    }
}

const otp_error: ToastMessage = () => {
    return {
        type: "error",
        body: "Váratlan hiba lépett fel a fiók hitelesítése során!"
    }
}

export const SignUpToast: ToastMessages = {
    success,
    error,
    otp_error,
    otp_expired,
    email_exists
}