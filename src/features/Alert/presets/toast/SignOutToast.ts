import { ToastMessage, ToastMessages } from "../../constants/constants.ts";

const success: ToastMessage = () => {
    return {
        type: "success",
        title: "Sikeres kijelentkezés!"
    }
}

const error: ToastMessage = () => {
    return {
        type: "error",
        body: "Váratlan hiba lépett fel a kijelentkezés!"
    }
}

export const SignOutToast: ToastMessages = {
    success,
    error
}