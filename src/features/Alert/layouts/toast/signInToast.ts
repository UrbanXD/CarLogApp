import { AlertToastProps } from "../../components/AlertToast";
import { ToastMessages } from "../../constants/constants";

const success: AlertToastProps = {
    type: "success",
    title: "Sikeres bejelentkezés!"
}

const error: AlertToastProps = {
    type: "error",
    body: "Váratlan hiba lépett fel a bejelentkezés közben!"
}

const invalid_credentials: AlertToastProps = {
    type: "warning",
    body: "Helytelen email cím és/vagy jelszó!"
}

export default {
    success,
    error,
    invalid_credentials,
} as ToastMessages