import { ToastMessage, ToastMessages } from "../../../../ui/alert/types/index.ts";

const success: ToastMessage = () => {
    return {
        type: "success",
        title: "Autó azonosítója módosítva!"
    };
};

const error: ToastMessage = () => {
    return {
        type: "error",
        body: "Váratlan hiba lépett fel az autó azonosítójának módosítása közben!"
    };
};

export const CarEditNameToast: ToastMessages = {
    success,
    error
};