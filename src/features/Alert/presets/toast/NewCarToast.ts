import { ToastMessage, ToastMessages } from "../../constants/types.ts";

const success: ToastMessage = () => {
    return {
        type: "success",
        body: "Az autó már be is parkolt az Ön virtuális garázsába!"
    }
}

const error: ToastMessage = ()=> {
    return {
        type: "error",
        body: "Váratlan hiba lépett fel az új autó létrehozása során, próbálja újra!"
    }
}

export const NewCarToast: ToastMessages = {
    success,
    error
}