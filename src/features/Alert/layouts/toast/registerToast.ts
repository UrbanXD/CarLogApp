import {AlertToastProps} from "../../components/AlertToast";

const success: AlertToastProps = {
    type: "success",
    title: "Sikeres regisztráció!"
}

const error: AlertToastProps = {
    type: "error",
    body: "Váratlan hiba lépett fel a regisztráció során!"
}

export default {
    success,
    error
}