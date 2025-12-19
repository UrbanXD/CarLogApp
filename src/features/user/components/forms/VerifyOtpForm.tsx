import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Input from "../../../../components/Input/Input.ts";
import { AuthApiError, EmailOtpType } from "@supabase/supabase-js";
import Divider from "../../../../components/Divider.tsx";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { useOtp } from "../../hooks/useOtp.ts";
import { Trans, useTranslation } from "react-i18next";

export type HandleVerificationOtpType = (errorCode?: string) => (Promise<void> | void)

type VerifyOTPProps = {
    type: EmailOtpType
    email: string
    otpLength?: number
    title?: string
    subtitle?: string
    handleVerification: HandleVerificationOtpType
}

function VerifyOtpForm({
    type,
    email,
    otpLength = 6,
    title,
    subtitle,
    handleVerification
}: VerifyOTPProps) {
    const { t } = useTranslation();
    const { verifyOTP, resendOTP } = useOtp();

    const defaultSubtitle = () =>
        <Text style={ styles.subtitleText }>
            <Trans
                i18nKey="auth.otp_verification.use_otp_code_for_verification"
                values={ { email } }
                parent={ Text }
                components={ {
                    email: <Text style={ styles.subtitleEmailText }/>
                } }
            />
        </Text>;

    const onSubmit = async (token: string) => {
        try {
            await verifyOTP({ email, token, type });

            await handleVerification();
        } catch(error: AuthApiError | any) {
            await handleVerification(error.code || "otp_error");
        }
    };

    const resend = async () => await resendOTP({ type, email });

    return (
        <View style={ styles.pageContainer }>
            <View style={ styles.titleContainer }>
                {
                    title &&
                   <Text style={ styles.titleText }>
                       { title }
                   </Text>
                }
                {
                    !subtitle
                    ? defaultSubtitle()
                    : <Text style={ styles.subtitleText }>
                        { subtitle }
                    </Text>
                }
            </View>
            <Input.OTP
                numberOfDigits={ otpLength }
                onSubmit={ onSubmit }
            />
            <Divider
                thickness={ 3.5 }
                color={ COLORS.gray3 }
            />
            <Text style={ styles.didntReceivedCodeText }>
                { t("auth.otp_verification.expired_or_didnt_received") }
                { "\n" }
                <Text
                    style={ styles.didntReceivedCodeLinkText }
                    onPress={ resend }
                >
                    { t("auth.otp_verification.resend") }
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    pageContainer: {
        gap: SEPARATOR_SIZES.normal
    },
    titleContainer: {
        gap: SEPARATOR_SIZES.lightSmall
    },
    titleText: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.h2,
        color: COLORS.white,
        lineHeight: FONT_SIZES.h2 * 1.25,
        letterSpacing: FONT_SIZES.h2 * 0.035,
        textAlign: "center"
    },
    subtitleText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p2,
        lineHeight: FONT_SIZES.p2 * 1.15,
        letterSpacing: FONT_SIZES.p2 * 0.035,
        color: COLORS.gray2,
        textAlign: "center"
    },
    subtitleEmailText: {
        fontFamily: "Gilroy-Heavy",
        color: COLORS.gray1
    },
    didntReceivedCodeText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p3,
        lineHeight: FONT_SIZES.p3 * 1.25,
        letterSpacing: FONT_SIZES.p3 * 0.035,
        color: COLORS.gray2,
        textAlign: "center"
    },
    didntReceivedCodeLinkText: {
        color: COLORS.fuelYellow,
        textDecorationLine: "underline"
    }
});

export default VerifyOtpForm;