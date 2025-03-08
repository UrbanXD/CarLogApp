import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Input from "../../../components/Input/Input.ts";
import { AuthApiError, EmailOtpType } from "@supabase/supabase-js";
import Divider from "../../../../../components/Divider.tsx";
import { Colors } from "../../../../../constants/colors/index.ts";
import { FONT_SIZES, SEPARATOR_SIZES } from "../../../../../constants/constants.ts";
import { useUserManagement } from "../../../../../hooks/useUserManagement.ts";

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
    const { verifyOTP, resendOTP } = useUserManagement();

    const defaultSubtitle = () =>
        <Text style={ styles.subtitleText }>
            Ehhez használja azt a kódódot amely a(z) <Text style={ styles.subtitleEmailText }>{ email }</Text> címre került kiküldésre.
        </Text>

    const onSubmit = async (token: string) => {
        try {
            await verifyOTP({
                email,
                token,
                type
            });

            await handleVerification();
        } catch (error: AuthApiError | any) {
            await handleVerification(error.code || "otp_error");
        }
    }

    const resend = async () =>
        await resendOTP({
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
                color={ Colors.gray3 }
            />
            <Text style={ styles.didntReceivedCodeText }>
                Nem érkezett meg a kód az adott email címére, esetleg a kód már lejárt?
                { "\n" }
                <Text style={ styles.didntReceivedCodeLinkText } onPress={ resend }>Újra küldés</Text>
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
        fontSize: FONT_SIZES.h2,
        color: Colors.white,
        lineHeight: FONT_SIZES.h2 * 1.25,
        letterSpacing: FONT_SIZES.h2 * 0.035,
        textAlign: "center"
    },
    subtitleText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p2,
        lineHeight: FONT_SIZES.p2 * 1.15,
        letterSpacing: FONT_SIZES.p2 * 0.035,
        color: Colors.gray2,
        textAlign: "center"
    },
    subtitleEmailText: {
        fontFamily: "Gilroy-Heavy",
        color: Colors.gray1
    },
    didntReceivedCodeText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p3,
        lineHeight: FONT_SIZES.p3 * 1.25,
        letterSpacing: FONT_SIZES.p3 * 0.035,
        color: Colors.gray2,
        textAlign: "center"
    },
    didntReceivedCodeLinkText: {
        color: Colors.fuelYellow,
        textDecorationLine: "underline"
    }
});

export default VerifyOTP;