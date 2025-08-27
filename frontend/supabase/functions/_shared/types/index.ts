export type Email = {
    to: Array<string>
    subject: string
    html: string
}

export type EmailAction =
    | "signup"
    | "delete"
    | "delete_verification"
    | "recovery"
    | "magiclink"
    | "invite"
    | "email_change_current"
    | "email_change_new"
    | string

export type UserRecord = {
    email: string
    new_email: string | null
    created_at: string | null
    confirmation_sent_at: string | null
    recovery_sent_at: string | null
}

export interface AuthEmailBody {
    user: UserRecord
    email_data: {
        token: string | null
        token_new: string | null
        email_action_type: EmailAction
    }
}

export interface WebhookEmailBody {
    record: UserRecord | null
    old_record: UserRecord | null
}