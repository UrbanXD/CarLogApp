import { ErrorCode } from "@supabase/auth-js/src/lib/error-codes.ts";

export type AlertType =
    "success" |
    "info" |
    "warning" |
    "error";

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

export type ToastMessage = (message?: string) => Partial<Toast>
export type ToastMessages = Record<ToastMessageCode, ToastMessage>

export type Toast = {
    id: string
    type: AlertType
    title: string
    body?: string
    duration: number
}

export type Modal = {
    icon?: string
    title?: string
    body?: string
    color: string
    acceptAction?: () => void
    acceptText: string
    dismissAction?: () => void
    dismissText: string
}

export type ModalAction = ({ name, acceptAction, dismissAction }: {
    name?: string,
    acceptAction?: () => void;
    dismissAction?: () => void
}) => Partial<Modal>

export type AlertState = {
    toasts: Array<Toast>
    modal: Modal
}