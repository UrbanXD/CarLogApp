import React from "react";
import { useDatabase } from "../../../Database/connector/Database";
import { StyleSheet, Text, View } from "react-native";
import Input from "../../../Form/components/Input/Input";
import { DEFAULT_SEPARATOR, FONT_SIZES, GLOBAL_STYLE, SEPARATOR_SIZES } from "../../../Shared/constants/constants";
import { theme } from "../../../Shared/constants/theme";
import Divider from "../../../Shared/components/Divider";
import { useLocalSearchParams } from "expo-router";
import { EmailOtpType } from "@supabase/supabase-js";

type VerifyRouteParams = {
    type: string
    title?: string
    email: string
    otpLength?: string
    toastMessages?: string
    replaceHREF?: string
}

const VerifyScreen: React.FC = () => {
    const { supabaseConnector } = useDatabase();

    const {
        type,
        title = "Hitelesítés",
        email,
        otpLength = 6,
        toastMessages,
        replaceHREF
    } = useLocalSearchParams<VerifyRouteParams>();

    const resendOTP = async () =>
        await supabaseConnector.resendOTP({
            type: "signup",
            email: email,
        });

    return (
        <View style={ styles.pageContainer }>
            <View style={ styles.titleContainer }>
                <Text style={ styles.titleText }>
                    { title }
                </Text>
                <Text style={ styles.subtitleText }>
                    Ehhez használja azt a kódódot amely a(z) <Text style={ styles.subtitleEmailText }>{ email }</Text> címre került kiküldésre.
                </Text>
            </View>
            <Input.OTP
                email={ email }
                otpType={ type as EmailOtpType || "magiclink" }
                numberOfDigits={ Number(otpLength || 6) }
                replaceHREF={ replaceHREF }
                toastMessages={ toastMessages ? JSON.parse(toastMessages) : undefined }
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
        ...GLOBAL_STYLE.pageContainer,
        gap: SEPARATOR_SIZES.normal,
        paddingHorizontal: DEFAULT_SEPARATOR
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

export default VerifyScreen;