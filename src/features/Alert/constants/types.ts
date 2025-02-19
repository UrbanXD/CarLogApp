import { AlertToastProps } from "../components/AlertToast.tsx";
import { AlertModalProps } from "../components/AlertModal.tsx";
import { ErrorCode } from "@supabase/auth-js/src/lib/error-codes.ts";

export type AddToastFunction = (args: AlertToastProps) => void;
export type OpenModalFunction = (args: AlertModalProps) => void;

export type ToastMessageCode = AlertType | "otp_error" | ErrorCode | string

export type ToastMessage = (message?: string) => AlertToastProps
export type ToastMessages = Record<ToastMessageCode, ToastMessage>

export type AlertType =
    "success" |
    "info" |
    "warning" |
    "error";