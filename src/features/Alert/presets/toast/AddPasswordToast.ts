import { ToastMessage, ToastMessages } from "../../constants/types.ts";

const success: ToastMessage = () => {
    return {
        type: "success",
        title: "Sikeres jelszó hozzárendelés!"
    }
}

const error: ToastMessage = () => {
    return {
        type: "error",
        body: "Váratlan hiba lépett fel a jelszó hozzárendelés sorám!"
    }
}

export const AddPasswordToast: ToastMessages = {
    success,
    error
}