import { ToastMessage, ToastMessages } from "../../../../ui/alert/model/types/index.ts";

const success: ToastMessage = () => {
    return {
        type: "success",
        title: "Sikeres törlés!"
    };
};

const error: ToastMessage = () => {
    return {
        type: "error",
        body: "Váratlan hiba lépett fel egy kiadás napló bejegyzés törlése során."
    };
};

export const DeleteExpenseToast: ToastMessages = {
    success,
    error
};