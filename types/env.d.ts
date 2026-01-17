declare module "@env" {
    export const SUPABASE_URL: string;
    export const SUPABASE_PUBLISHABLE_KEY: string;
    export const SUPABASE_ATTACHMENT_BUCKET: string;
    export const SUPABASE_SEED_BUCKET: string;
    export const RESEND_API_KEY: string;
    export const POWERSYNC_URL: string;
    export const MAIN_DATABASE_NAME: string;
    export const SEED_DATABASE_NAME: string;
    export const GOOGLE_WEBCLIENTID: string;
    export const LOCAL_STORAGE_KEY_SELECTED_CAR_INDEX: string;
    export const LOCAL_STORAGE_KEY_NOT_VERIFIED_EMAIL: string;
    export const LOCAL_STORAGE_KEY_LANGUAGE: string;
    export const LOCAL_STORAGE_KEY_LAST_LOCAL_IMAGE_CLEANUP: string;
    export const LOCAL_STORAGE_KEY_GLOBAL_SEED_DB_LAST_MODIFICATION: string;
    export const LOCAL_IMAGE_CLEANUP_INTERVAL_MS: string;
    export const LOCAL_IMAGE_CLEANUP_GRACE_PERIOD_MS: string;
}