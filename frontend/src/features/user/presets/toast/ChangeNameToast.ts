import { ToastMessage, ToastMessages } from "../../../../ui/alert/model/types/index.ts";

const success: ToastMessage = () => {
    return {
        type: "success",
        title: "Név módosítva!"
    };
};

const error: ToastMessage = () => {
    return {
        type: "error",
        body: "Váratlan hiba lépett fel a név módosítása közben!"
    };
};

export const ChangeNameToast: ToastMessages = {
    success,
    error
};