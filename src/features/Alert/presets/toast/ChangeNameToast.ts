import { AlertToastProps } from "../../components/AlertToast.tsx";
import { ToastMessages } from "../../constants/constants.ts";

const success: AlertToastProps = {
    type: "success",
    title: "Név módosítva!"
}

const error: AlertToastProps = {
    type: "error",
    body: "Váratlan hiba lépett fel a név módosítása közben!"
}

export const ChangeNameToast: ToastMessages = {
    success,
    error
}