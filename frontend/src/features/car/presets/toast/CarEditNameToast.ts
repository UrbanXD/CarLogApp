import { ToastMessage, ToastMessages } from "../../../../ui/alert/model/types/index.ts";

const success: ToastMessage = () => {
    return {
        type: "success",
        title: "Sikeres módosítás!"
    };
};

const error: ToastMessage = () => {
    return {
        type: "error",
        body: "Váratlan hiba lépett fel módosítás közben!"
    };
};

export const CarEditNameToast: ToastMessages = {
    success,
    error
};