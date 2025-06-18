import React, { useCallback } from "react";
import { ImageBackground, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { COLORS, DEFAULT_SEPARATOR, FONT_SIZES, GLOBAL_STYLE, SEPARATOR_SIZES } from "../constants/index.ts";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../components/Button/Button";
import Divider from "../components/Divider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomSheet } from "../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { SignInBottomSheet, SignUpBottomSheet } from "../features/user/presets/bottomSheet/index.ts";
import { useAuth } from "../contexts/Auth/AuthContext.ts";
import { useUserManagement } from "../features/user/hooks/useUserManagement.ts";

const AuthScreen: React.FC = () => {
    const { top } = useSafeAreaInsets();
    const { openBottomSheet } = useBottomSheet();
    const { session, notVerifiedUser } = useAuth();
    const { openUserVerification } = useUserManagement();

    const openSignUp =
        () => openBottomSheet(SignUpBottomSheet);

    const openSignIn =
        () => openBottomSheet(SignInBottomSheet);


    const openVerification = useCallback( () => {
        if(notVerifiedUser && notVerifiedUser.email) {
            openUserVerification(notVerifiedUser.email);
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
                        color={ COLORS.fuelYellow }
                    />
                    <Text style={ styles.subtitle }>Kezelje nálunk autóit</Text>
                </View>
                <View style={ styles.actionContainer }>
                    <Button.Text
                        text="Regisztráció"
                        onPress={ openSignUp }
                    />
                    <Text style={ styles.underButtonText }>
                        Már rendelkezel felhasználóval?
                        { "\n" }
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
            paddingBottom: GLOBAL_STYLE.pageContainer.paddingBottom,
        },
        titleContainer: {
            top: -SEPARATOR_SIZES.lightLarge,
            gap: SEPARATOR_SIZES.mediumSmall,
        },
        title: {
            zIndex: 1,
            top: hp(FONT_SIZES.title / -12),
            alignSelf: "center",
            color: COLORS.white,
            fontSize: FONT_SIZES.title,
            fontFamily: "Gilroy-Heavy",
            textTransform: "uppercase",
        },
        titleEffect: {
            zIndex: 0,
            position: "absolute", top: -hp(2.5),
            color: GLOBAL_STYLE.pageContainer.backgroundColor,
            textShadowOffset: { height: 0, width: 0 },
            textShadowColor: COLORS.white,
            textShadowRadius: 1,
            textAlign: "center",
        },
        subtitle: {
            alignSelf: "center",
            color: COLORS.gray2,
            fontSize: FONT_SIZES.p1,
            fontFamily: "Gilroy-Medium",
            textTransform: "uppercase",
            letterSpacing: FONT_SIZES.p1 * 0.05
        },
        actionContainer: {
            flexDirection: "column",
            gap: SEPARATOR_SIZES.normal
        },
        underButtonText:{
            color: COLORS.white,
            alignSelf: "center",
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.p2,
            letterSpacing: FONT_SIZES.p2 * 0.05,
            lineHeight: FONT_SIZES.p2 * 1.25,
            textAlign: "center",
        },
        linkText: {
            color: COLORS.fuelYellow,
            textDecorationLine: "underline",
            fontSize: FONT_SIZES.p1,
            lineHeight: FONT_SIZES.p1 * 1.25,
            letterSpacing: FONT_SIZES.p1 * 0.05,
        },
        verificationContainer: {
            position: "absolute",
            top: top * 1.5,
            right: GLOBAL_STYLE.contentContainer.paddingHorizontal,
        },
        verificationIcon: {
            borderColor: COLORS.gray4,
            borderWidth: 0.75
        },
        verificationText: {
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.p3,
            color: COLORS.white,
            textShadowColor: COLORS.black,
            textShadowRadius: 15,
        }
    })

export default AuthScreen;
