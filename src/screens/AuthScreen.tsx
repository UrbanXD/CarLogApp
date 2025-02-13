import React, { useCallback } from "react";
import { ImageBackground, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { DEFAULT_SEPARATOR, FONT_SIZES, GLOBAL_STYLE, SEPARATOR_SIZES } from "../constants/constants";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { theme } from "../constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../components/Button/Button";
import Divider from "../components/Divider";
import { useSession } from "../features/Auth/context/SessionProvider.tsx";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAlert } from "../features/Alert/context/AlertProvider.tsx";
import { useBottomSheet } from "../features/BottomSheet/context/BottomSheetContext.ts";
import { EmailVerificationBottomSheet, SignInBottomSheet, SignUpBottomSheet } from "../features/BottomSheet/presets";

const AuthScreen: React.FC = () => {
    const { top } = useSafeAreaInsets();
    const { openBottomSheet } = useBottomSheet();
    const { addToast } = useAlert();
    const { session, notVerifiedUser } = useSession();

    const openSignUp =
        () => openBottomSheet(SignUpBottomSheet);

    const openSignIn =
        () => openBottomSheet(SignInBottomSheet);


    const openVerification = useCallback( () => {
        if(notVerifiedUser && notVerifiedUser.email) {
            openBottomSheet(EmailVerificationBottomSheet(addToast));
        }
    }, [notVerifiedUser])

    const styles = useStyles(top);

    return (
        <SafeAreaView style={ styles.pageContainer }>
            <ImageBackground
                source={ require("../assets/images/home2.jpg") }
                style={ styles.imageContainer }
            >
                <LinearGradient
                    locations={ [ 0, 0.35, 0.85 ] }
                    colors={[
                        "transparent",
                        "rgba(0,0,0,0.25)",
                        GLOBAL_STYLE.pageContainer.backgroundColor
                    ]}
                    style={ styles.imageGradientOverlay }
                />
            </ImageBackground>
            <View style={ styles.contentContainer }>
                <View style={ styles.titleContainer }>
                    <Text style={ styles.title }>Carlog</Text>
                    <Text style={ [styles.title, styles.titleEffect] }>Carlog</Text>
                    <Text style={ [styles.title, styles.titleEffect, { top: hp(2.5), zIndex: -1 }] }>Carlog</Text>
                    <Divider
                        size={ wp(70) }
                        thickness={ 2 }
                        color={ theme.colors.fuelYellow }
                    />
                    <Text style={ styles.subtitle }>Kezelje nálunk autóit</Text>
                </View>
                <View style={ styles.actionContainer }>
                    <Button.Text
                        text="Regisztráció"
                        onPress={ openSignUp }
                    />
                    <Text style={ styles.underButtonText }>
                        Már rendelkezel felhasználóval ?
                        <Text
                            style={ styles.linkText }
                            onPress={ openSignIn }
                        >
                            Jelentkezz be
                        </Text>
                    </Text>
                </View>
            </View>
            {
                !session && notVerifiedUser &&
                <View style={ styles.verificationContainer }>
                    <Button.Icon
                        icon={ "email-seal-outline" }
                        onPress={ openVerification }
                        style={ styles.verificationIcon }
                    />
                    <Text
                        onPress={ openVerification }
                        style={ styles.verificationText }
                    >
                        Hitelesítés{"\n"}folytatása
                    </Text>
                </View>
            }
        </SafeAreaView>
    )
}

const useStyles = (top: number) =>
    StyleSheet.create({
        pageContainer: {
            ...GLOBAL_STYLE.pageContainer,
            paddingBottom: DEFAULT_SEPARATOR,
            paddingVertical: 0,
        },
        imageContainer: {
            flex: 0.85,

        },
        imageGradientOverlay: {
            ...StyleSheet.absoluteFillObject,
            top: 20
        },
        contentContainer: {
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "transparent",
            paddingHorizontal: DEFAULT_SEPARATOR,
            paddingBottom: GLOBAL_STYLE.pageContainer.paddingVertical,
        },
        titleContainer: {
            top: -SEPARATOR_SIZES.lightLarge,
            gap: SEPARATOR_SIZES.mediumSmall,
        },
        title: {
            zIndex: 1,
            top: hp(FONT_SIZES.extraLarge / -12),
            alignSelf: "center",
            color: theme.colors.white,
            fontSize: FONT_SIZES.extraLarge,
            fontFamily: "Gilroy-Heavy",
            textTransform: "uppercase",
        },
        titleEffect: {
            zIndex: 0,
            position: "absolute", top: -hp(2.5),
            color: GLOBAL_STYLE.pageContainer.backgroundColor,
            textShadowOffset: { height: 0, width: 0 },
            textShadowColor: theme.colors.white,
            textShadowRadius: 1,
            textAlign: "center",
        },
        subtitle: {
            alignSelf: "center",
            color: theme.colors.gray2,
            fontSize: FONT_SIZES.normal,
            fontFamily: "Gilroy-Medium",
            textTransform: "uppercase",
            letterSpacing: FONT_SIZES.normal * 0.05
        },
        actionContainer: {
            flexDirection: "column",
            gap: SEPARATOR_SIZES.normal
        },
        underButtonText:{
            color: theme.colors.white,
            alignSelf: "center",
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.small,
            letterSpacing: FONT_SIZES.small * 0.05,
            lineHeight: FONT_SIZES.small * 1.5,
            textAlign: "center",
        },
        linkText: {
            color: theme.colors.fuelYellow,
            textDecorationLine: "underline",
            fontSize: FONT_SIZES.small * 1.05,
            letterSpacing: FONT_SIZES.small * 1.05 * 0.05,
        },
        verificationContainer: {
            position: "absolute",
            top: top * 1.5,
            right: GLOBAL_STYLE.contentContainer.paddingHorizontal,
        },
        verificationIcon: {
            borderColor: theme.colors.gray4,
            borderWidth: 0.75
        },
        verificationText: {
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.tiny * 0.925,
            color: theme.colors.white,
            textShadowColor: theme.colors.black,
            textShadowRadius: 15,
        }
    })

export default AuthScreen;
