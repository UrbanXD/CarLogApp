import {AlertToastProps} from "../../components/AlertToast";

const success: AlertToastProps = {
    type: "success",
    body: "Az autó már be is parkolt az Ön virtuális garázsába!"
}

const error: AlertToastProps = {
    type: "error",
    body: "Váratlan hiba lépett fel az új autó létrehozása során, próbálja újra!"
}

export default {
    success,
    error
}