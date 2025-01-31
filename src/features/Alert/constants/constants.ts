import { theme } from "../../../constants/theme";
import { ErrorCode } from "@supabase/auth-js/src/lib/error-codes";
import { AlertToastProps } from "../components/AlertToast";

export type ToastMessages = Record<"success" | "error" | "otp_error" | ErrorCode | string, AlertToastProps>

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