import { ResendParams, VerifyEmailOtpParams } from "@supabase/supabase-js";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";

export const useOtp = () => {
    const { supabaseConnector } = useDatabase();

    const verifyOTP = async (args: VerifyEmailOtpParams) => {
        const { data: { session }, error } = await supabaseConnector.client.auth.verifyOtp(args);

        if(error) throw error;

        if(session) await supabaseConnector.client.auth.setSession(session);
    };

    const resendOTP = async (args: ResendParams) => {
        const { error } = await supabaseConnector.client.auth.resend(args);

        if(error) throw error;
    };

    return {
        verifyOTP,
        resendOTP
    };
};