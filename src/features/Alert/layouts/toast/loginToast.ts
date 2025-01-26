import {AlertToastProps} from "../../components/AlertToast";

const success: AlertToastProps = {
    type: "success",
    title: "Sikeres bejelentkezés!"
}

const error: AlertToastProps = {
    type: "error",
    body: "Váratlan hiba lépett fel a bejelentkezés közben!"
}

export default {
    success,
    error
}