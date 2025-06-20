import { ToastMessage, ToastMessages } from "../../../../ui/alert/types/index.ts";

const success: ToastMessage = () => {
    return {
        type: "success",
        title: "Sikeres kijelentkezés!"
    };
};

const error: ToastMessage = () => {
    return {
        type: "error",
        body: "Váratlan hiba lépett fel a kijelentkezés!"
    };
};

export const SignOutToast: ToastMessages = {
    success,
    error
};