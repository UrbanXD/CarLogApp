import { AlertToastProps } from "../components/AlertToast.tsx";
import { AlertModalProps } from "../components/AlertModal.tsx";
import { ErrorCode } from "@supabase/auth-js/src/lib/error-codes.ts";

export type AddToastFunction = (args: AlertToastProps) => void;
export type OpenModalFunction = (args: AlertModalProps) => void;

// 12501 = GOOGLE AUTH FLOW CANCELLED CODE
// ASYNC_OP_IN_PROGRESS = GOOGLE AUTH OPERATION IS IN PROGRESS ALREADY
export type ToastMessageCode =
    AlertType
    | "otp_error"
    | "token_missing"
    | "12501"
    | "ASYNC_OP_IN_PROGRESS"
    | ErrorCode
    | string

export type ToastMessage = (message?: string) => AlertToastProps
export type ToastMessages = Record<ToastMessageCode, ToastMessage>

export type AlertType =
    "success" |
    "info" |
    "warning" |
    "error";