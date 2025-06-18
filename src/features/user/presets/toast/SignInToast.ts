import { ToastMessage, ToastMessages } from "../../../../ui/alert/types/index.ts";

const success: ToastMessage = () => {
    return {
        type: "success",
        title: "Sikeres bejelentkezés!"
    }
}

const error: ToastMessage = () => {
    return {
        type: "error",
        body: "Váratlan hiba lépett fel a bejelentkezés közben!"
    }
}

const invalid_credentials: ToastMessage = () => {
    return {
        type: "warning",
        body: "Helytelen email cím és/vagy jelszó!"
    }
}

export const SignInToast: ToastMessages = {
    success,
    error,
    invalid_credentials,
}