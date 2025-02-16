import { AlertToastProps } from "../../components/AlertToast.tsx";
import { ToastMessages } from "../../constants/constants.ts";

const success: AlertToastProps = {
    type: "success",
    title: "Jelszó módosítva!"
}

const over_email_send_rate_limit = (seconds: number | string) => {
    return {
        type: "warning",
        title: "Pihenjen kicsit!",
        body: `Túl sok email kérelem rövid időn belül, kérjük várjon ${ seconds } másodpercet.`
    }
}

const otp_expired: AlertToastProps = {
    type: "warning",
    body: "Az Ön által megadott kód érvénytelen, esetleg lejárt."
}

const error: AlertToastProps = {
    type: "error",
    body: "Váratlan hiba lépett fel a jelszó módosítása közben!"
}

export const ResetPasswordToast: ToastMessages = {
    success,
    error,
    over_email_send_rate_limit,
    otp_expired
}