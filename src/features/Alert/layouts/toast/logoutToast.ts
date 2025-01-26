import { AlertToastProps } from "../../components/AlertToast";

const success: AlertToastProps = {
    type: "success",
    title: "Sikeres kijelentkezés!"
}

const error: AlertToastProps = {
    type: "error",
    body: "Váratlan hiba lépett fel a kijelentkezés!"
}

export default {
    success,
    error
}