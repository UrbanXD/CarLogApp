import { ResendParams, VerifyEmailOtpParams } from "@supabase/supabase-js";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_EXPIRY_LIMIT = 55 * 60 * 1000; //1hour token life but set it to 55min
const MAX_FREE_ATTEMPTS = 3; //resend with default supabase 1 minute limit

export const useOtp = () => {
    const { supabaseConnector } = useDatabase();

    const getOTPTimeLimitStorageKey = (type: string, email: string) => `${ type }-${ email }`;

    const setOTPTimeLimitStorage = async (type: string, email: string, attempts: number = 0) => {
        const now = Date.now();

        await AsyncStorage.setItem(
            getOTPTimeLimitStorageKey(type, email),
            JSON.stringify({ attempts: attempts ?? 0, lastSend: now })
        );
    };

    const verifyOTP = async (args: VerifyEmailOtpParams) => {
        const { data: { session }, error } = await supabaseConnector.client.auth.verifyOtp(args);

        if(error) throw error;

        if(session) {
            await supabaseConnector.client.auth.setSession(session);
            await AsyncStorage.removeItem(getOTPTimeLimitStorageKey(args.type, args.email));
        }
    };

    const resendOTP = async (args: ResendParams & { email: string }, automatic: boolean = false) => {
        const key = getOTPTimeLimitStorageKey(args.type, args.email);
        const storedData = await AsyncStorage.getItem(key);
        const now = Date.now();

        let attempts = 0;
        let lastSend = 0;

        if(storedData) {
            const parsed = JSON.parse(storedData);
            attempts = parsed.attempts ?? 0;
            lastSend = parsed.lastSend ?? 0;
        }

        if(automatic && lastSend > 0) {
            const diff = now - lastSend;
            if(diff < TOKEN_EXPIRY_LIMIT) return;
        }

        if(attempts >= MAX_FREE_ATTEMPTS) {
            const diff = now - lastSend;
            if(diff < TOKEN_EXPIRY_LIMIT) {
                const remainingMin = Math.ceil((TOKEN_EXPIRY_LIMIT - diff) / 1000 / 60);
                throw new Error(`To many resend attempt, wait ${ remainingMin } minutes.`);
            } else {
                attempts = 0;
            }
        }

        try {
            const { error } = await supabaseConnector.client.auth.resend(args);

            if(error) throw error;

            const newData = {
                attempts: attempts + 1,
                lastSend: now
            };

            await AsyncStorage.setItem(key, JSON.stringify(newData));
        } catch(e) {
            throw e;
        }
    };

    return {
        verifyOTP,
        resendOTP,
        setOTPTimeLimitStorage
    };
};