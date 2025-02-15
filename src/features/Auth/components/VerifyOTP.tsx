import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Input from "../../Form/components/Input/Input.ts";
import { AuthApiError, EmailOtpType } from "@supabase/supabase-js";
import Divider from "../../../components/Divider.tsx";
import { theme } from "../../../constants/theme.ts";
import { FONT_SIZES, SEPARATOR_SIZES } from "../../../constants/constants.ts";
import { useDatabase } from "../../Database/connector/Database.ts";

export type HandleVerificationOtpType =
    (errorCode?: string) => ( Promise<void> | void )

interface VerifyOTPProps {
    type: EmailOtpType
    email: string
    otpLength?: number
    title?: string
    subtitle?: string
    handleVerification: HandleVerificationOtpType
}

const VerifyOTP: React.FC<VerifyOTPProps> = ({
    type,
    email,
    otpLength = 6,
    title,
    subtitle,
    handleVerification,
}) => {
    const { supabaseConnector } = useDatabase();

    const defaultSubtitle = () =>
        <Text style={ styles.subtitleText }>
            Ehhez használja azt a kódódot amely a(z) <Text style={ styles.subtitleEmailText }>{ email }</Text> címre került kiküldésre.
        </Text>

    const onSubmit = async (token: string) => {
        try {
            await supabaseConnector.verifyOTP({
                email,
                token,
                type
            });

            await handleVerification();
        } catch (error: AuthApiError | any) {
            await handleVerification(error.code || "otp_error");
        }
    }

    const resendOTP = async () =>
        await supabaseConnector.resendOTP({
            type: "signup",
            email: email,
        });

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
                        ?   defaultSubtitle()
                        :   <Text style={ styles.subtitleText }>
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
                color={ theme.colors.gray3 }
            />
            <Text style={ styles.didntReceivedCodeText }>
                Nem érkezett meg a kód az adott email címére, esetleg a kód már lejárt? <Text style={ styles.didntReceivedCodeLinkText } onPress={ resendOTP }>Újra küldés</Text>
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        gap: SEPARATOR_SIZES.normal,
    },
    titleContainer: {
        gap: SEPARATOR_SIZES.lightSmall
    },
    titleText: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.medium,
        color: theme.colors.white,
        letterSpacing: FONT_SIZES.intermediate * 0.05,
        textAlign: "center"
    },
    subtitleText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.intermediate,
        lineHeight: FONT_SIZES.intermediate * 1.15,
        letterSpacing: FONT_SIZES.intermediate * 0.035,
        color: theme.colors.gray2,
        textAlign: "center"
    },
    subtitleEmailText: {
        fontFamily: "Gilroy-Heavy",
        color: theme.colors.gray1
    },
    didntReceivedCodeText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.small,
        lineHeight: FONT_SIZES.small * 1.35,
        letterSpacing: FONT_SIZES.small * 0.05,
        color: theme.colors.gray2,
        textAlign: "center"
    },
    didntReceivedCodeLinkText: {
        color: theme.colors.fuelYellow,
        textDecorationLine: "underline"
    }
});

export default VerifyOTP;