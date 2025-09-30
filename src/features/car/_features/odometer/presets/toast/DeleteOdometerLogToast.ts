import { ToastMessage, ToastMessages } from "../../../../../../ui/alert/model/types/index.ts";

const success: ToastMessage = () => {
    return {
        type: "success",
        title: "Sikeres törlés!"
    };
};

const error: ToastMessage = () => {
    return {
        type: "error",
        body: "Váratlan hiba lépett fel a kilométeróra-állás napló bejegyzás törlése során."
    };
};

export const DeleteOdometerLogToast: ToastMessages = {
    success,
    error
};