import { ResendParams, VerifyEmailOtpParams } from "@supabase/supabase-js";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";

export const useOtp = () => {
    const { supabaseConnector } = useDatabase();

    const verifyOTP = async (args: VerifyEmailOtpParams) => {
        const { data, error } = await supabaseConnector.client.auth.verifyOtp(args);

        if(error) throw error;

        await supabaseConnector.client.auth.setSession(data.session);
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