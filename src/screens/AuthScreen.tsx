import React, { useCallback } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { COLORS, DEFAULT_SEPARATOR, FONT_SIZES, GLOBAL_STYLE, SEPARATOR_SIZES } from "../constants/index.ts";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../components/Button/Button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomSheet } from "../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { SignInBottomSheet, SignUpBottomSheet } from "../features/user/presets/bottomSheet/index.ts";
import { useAuth } from "../contexts/auth/AuthContext.ts";
import { useUserManagement } from "../features/user/hooks/useUserManagement.ts";
import Animated, { FadeIn, SlideInRight } from "react-native-reanimated";
import Title from "../components/Title.tsx";
import Divider from "../components/Divider.tsx";

const AuthScreen: React.FC = () => {
    const { top } = useSafeAreaInsets();
    const { openBottomSheet } = useBottomSheet();
    const { session, notVerifiedUser } = useAuth();
    const { openUserVerification } = useUserManagement();

    const openSignUp =
        () => openBottomSheet(SignUpBottomSheet);

    const openSignIn =
        () => openBottomSheet(SignInBottomSheet);


    const openVerification = useCallback(() => {
        if(notVerifiedUser && notVerifiedUser.email) {
            openUserVerification(notVerifiedUser.email);
        }
    }, [notVerifiedUser]);

    const styles = useStyles(top);

    return (
        <SafeAreaView style={ styles.pageContainer }>
            <View style={ styles.imageContainer }>
                <Animated.Image
                    entering={ FadeIn.duration(300) }
                    source={ require("../assets/images/home2.jpg") }
                    style={ { width: "100%", height: "100%" } }
                    resizeMode="cover"
                />
                <LinearGradient
                    locations={ [0, 0.35, 0.85] }
                    colors={ [
                        "transparent",
                        "rgba(0,0,0,0.25)",
                        GLOBAL_STYLE.pageContainer.backgroundColor
                    ] }
                    style={ StyleSheet.absoluteFillObject }
                />
            </View>
            <View style={ styles.contentContainer }>
                <View style={ styles.titleContainer }>
                    <Title text="Carlog"/>
                    <Animated.View entering={ FadeIn.duration(300) } style={ styles.titleContainer.info }>
                        <Divider
                            size={ widthPercentageToDP(50) }
                            thickness={ 2 }
                            color={ COLORS.gray2 }
                        />
                        <Text style={ styles.subtitle }>Kezelje nálunk autóit</Text>
                    </Animated.View>
                </View>
                <Animated.View entering={ FadeIn.duration(300) } style={ styles.actionContainer }>
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
                !session && notVerifiedUser &&
               <Animated.View entering={ SlideInRight.duration(500) } style={ styles.verificationContainer }>
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
        </SafeAreaView>
    );
};

const useStyles = (top: number) =>
    StyleSheet.create({
        pageContainer: {
            flex: 1,
            backgroundColor: COLORS.black2
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
                gap: SEPARATOR_SIZES.mediumSmall - 3
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
            right: GLOBAL_STYLE.contentContainer.paddingHorizontal
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
