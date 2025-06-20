import { ToastMessage, ToastMessages } from "../../../../ui/alert/types/index.ts";

const success: ToastMessage = () => {
    return {
        type: "success",
        title: "Jelszó módosítva!"
    };
};

const over_email_send_rate_limit: ToastMessage = (seconds?: string) => {
    return {
        type: "warning",
        title: "Pihenjen kicsit!",
        body: `Túl sok email kérelem rövid időn belül, kérjük várjon ${ seconds } másodpercet.`
    };
};

const otp_expired: ToastMessage = () => {
    return {
        type: "warning",
        body: "Az Ön által megadott kód érvénytelen, esetleg lejárt."
    };
};

const error: ToastMessage = () => {
    return {
        type: "error",
        body: "Váratlan hiba lépett fel a jelszó módosítása közben!"
    };
};

export const ResetPasswordToast: ToastMessages = {
    success,
    error,
    over_email_send_rate_limit,
    otp_expired
};