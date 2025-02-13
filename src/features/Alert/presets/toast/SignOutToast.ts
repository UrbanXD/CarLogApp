import { AlertToastProps } from "../../components/AlertToast";
import {ToastMessages} from "../../constants/constants.ts";

const success: AlertToastProps = {
    type: "success",
    title: "Sikeres kijelentkezés!"
}

const error: AlertToastProps = {
    type: "error",
    body: "Váratlan hiba lépett fel a kijelentkezés!"
}

export const SignOutToast: ToastMessages = {
    success,
    error
}