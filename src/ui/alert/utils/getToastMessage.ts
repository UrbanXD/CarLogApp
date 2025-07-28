import { AlertToastProps } from "../components/toast/AlertToast.tsx";
import { ToastMessages } from "../model/types/index.ts";

export const getToastMessage: (
    args: {
        messages: ToastMessages
        error?: unknown
        defaultErrorCode?: string
    }
) => AlertToastProps = ({
    messages,
    error = null,
    defaultErrorCode = "error"
}) => {
    if(error === null) messages.success();

    if(typeof error === "object" && error && "code" in error && typeof error.code === "string") {
        let message: string | undefined;

        if(error.code === "over_email_send_rate_limit" && "message" in error && typeof error.message === "string") {
            const secondsMatch =
                error.message.match(/\d+/);

            let seconds: number = 60;
            if(secondsMatch) seconds = parseInt(secondsMatch[0], 10);

            message = String(seconds);
        }

        const getToast = messages[error.code] || messages[defaultErrorCode] || messages.error;
        return getToast ? getToast(message) : { type: "error", body: "Váratlan hiba lépett fel!" };
    }

    const getToast = messages[defaultErrorCode] || messages.error;
    return getToast ? getToast() : { type: "error", body: "Váratlan hiba lépett fel!" };
};