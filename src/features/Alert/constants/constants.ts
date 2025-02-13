import { theme } from "../../../constants/theme";
import { ErrorCode } from "@supabase/auth-js/src/lib/error-codes";
import { AlertToastProps } from "../components/AlertToast";
import { AlertModalProps } from "../components/AlertModal.tsx";

export type AddToastFunction = (args: AlertToastProps) => void;
export type OpenModalFunction = (args: AlertModalProps) => void;

export type ToastMessages = Record<AlertType | "otp_error" | ErrorCode | string, AlertToastProps | ((message: string) => AlertToastProps)>

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