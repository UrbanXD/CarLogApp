import { theme } from "../../../constants/theme";
import { ErrorCode } from "@supabase/auth-js/src/lib/error-codes";
import { AlertToastProps } from "../components/AlertToast";
import { AlertModalProps } from "../components/AlertModal.tsx";

export type AddToastFunction = (args: AlertToastProps) => void;
export type OpenModalFunction = (args: AlertModalProps) => void;

type ToastMessageCode = AlertType | "otp_error" | ErrorCode | string

export type ToastMessage = (message?: string | number) => AlertToastProps
export type ToastMessages = Record<ToastMessageCode, ToastMessage>

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
                if (secondsMatch) seconds = parseInt(secondsMatch[0], 10);

                message = String(seconds);
            }

            return messages[error.code](message);
        }

        return messages[defaultErrorCode]() || messages.error();
    }

export type AlertType =
    "success" |
    "info" |
    "warning" |
    "error";

export const ALERT_COLORS = {
    success: theme.colors.greenLight,
    info: theme.colors.blueLight,
    warning: theme.colors.fuelYellow,
    error: theme.colors.redDark,
}

export const ALERT_ICONS = {
    success: "check-circle-outline",
    info: "information-outline",
    warning: "alert-outline",
    error: "alert-circle-outline",
}

export const ALERT_TITLES = {
    success: "Sikeres művelet",
    info: "Információ",
    warning: "Figyelmeztetés",
    error: "Hiba",
}