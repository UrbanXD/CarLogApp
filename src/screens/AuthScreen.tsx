import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, DEFAULT_SEPARATOR, FONT_SIZES, SECONDARY_COLOR, SEPARATOR_SIZES } from "../constants/index.ts";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../components/Button/Button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SignInBottomSheet, SignUpBottomSheet } from "../features/user/presets/bottomSheet/index.ts";
import { useAuth } from "../contexts/auth/AuthContext.ts";
import Animated, { FadeIn, SlideInRight } from "react-native-reanimated";
import Divider from "../components/Divider.tsx";
import CarlogTitle from "../components/CarlogTitle.tsx";
import { router } from "expo-router";

const AuthScreen: React.FC = () => {
    const { top, bottom } = useSafeAreaInsets();
    const { authenticated, notVerifiedUser, openAccountVerification } = useAuth();

    const ENTERING_ANIMATION_DURATION = 300;

    const openSignUp = () => router.push("bottomSheet/signUp");
    const openSignIn = () => router.push("bottomSheet/signIn");


    const openVerification = useCallback(() => {
        if(notVerifiedUser && notVerifiedUser.email) openAccountVerification(notVerifiedUser.email);
    }, [notVerifiedUser]);

    const styles = useStyles(top, bottom);

    return (
        <View style={ styles.pageContainer }>
            <View style={ styles.imageContainer }>
                <Animated.Image
                    entering={ FadeIn.duration(ENTERING_ANIMATION_DURATION) }
                    source={ require("../assets/images/home2.jpg") }
                    style={ { width: "100%", height: "100%" } }
                    resizeMode="cover"
                />
                <LinearGradient
                    locations={ [0, 0.35, 0.85] }
                    colors={ ["transparent", "rgba(0,0,0,0.25)", SECONDARY_COLOR] }
                    style={ StyleSheet.absoluteFillObject }
                />
            </View>
            <View style={ styles.contentContainer }>
                <View style={ styles.titleContainer }>
                    <CarlogTitle animated={ false }/>
                    <Animated.View
                        entering={ FadeIn.duration(ENTERING_ANIMATION_DURATION) }
                        style={ styles.titleContainer.info }
                    >
                        <Divider
                            size={ widthPercentageToDP(50) }
                            thickness={ 2 }
                            color={ COLORS.gray2 }
                        />
                        <Text style={ styles.subtitle }>Kezelje nálunk autóit</Text>
                    </Animated.View>
                </View>
                <Animated.View
                    entering={ FadeIn.duration(ENTERING_ANIMATION_DURATION) }
                    style={ styles.actionContainer }
                >
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
                </Animated.View>
            </View>
            {
                !authenticated && notVerifiedUser &&
               <Animated.View
                  entering={ SlideInRight.duration(ENTERING_ANIMATION_DURATION * 1.5) }
                  style={ styles.verificationContainer }
               >
                  <Button.Icon
                     icon={ "email-seal-outline" }
                     onPress={ openVerification }
                     style={ styles.verificationIcon }
                  />
                  <Text
                     onPress={ openVerification }
                     style={ styles.verificationText }
                  >
                     Hitelesítés{ "\n" }folytatása
                  </Text>
               </Animated.View>
            }
        </View>
    );
};

const useStyles = (top: number, bottom: number) =>
    StyleSheet.create({
        pageContainer: {
            flex: 1,
            backgroundColor: COLORS.black2,
            paddingBottom: bottom
        },
        imageContainer: {
            flex: 1,
            overflow: "hidden",
            position: "relative"

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
            paddingHorizontal: DEFAULT_SEPARATOR
        },
        titleContainer: {
            flex: 1,
            top: -SEPARATOR_SIZES.lightLarge,
            gap: SEPARATOR_SIZES.mediumSmall,

            info: {
                gap: SEPARATOR_SIZES.mediumSmall
            }
        },
        subtitle: {
            alignSelf: "center",
            color: COLORS.gray1,
            fontSize: FONT_SIZES.p1,
            fontFamily: "Gilroy-Medium",
            textTransform: "uppercase",
            letterSpacing: FONT_SIZES.p1 * 0.05
        },
        actionContainer: {
            flexDirection: "column",
            gap: SEPARATOR_SIZES.normal,
            marginBottom: DEFAULT_SEPARATOR
        },
        underButtonText: {
            color: COLORS.white,
            alignSelf: "center",
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.p2,
            letterSpacing: FONT_SIZES.p2 * 0.05,
            lineHeight: FONT_SIZES.p2 * 1.25,
            textAlign: "center"
        },
        linkText: {
            color: COLORS.fuelYellow,
            textDecorationLine: "underline",
            fontSize: FONT_SIZES.p1,
            lineHeight: FONT_SIZES.p1 * 1.25,
            letterSpacing: FONT_SIZES.p1 * 0.05
        },
        verificationContainer: {
            position: "absolute",
            top: top * 1.5,
            right: DEFAULT_SEPARATOR
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
            textShadowRadius: 15
        }
    });

export default AuthScreen;
