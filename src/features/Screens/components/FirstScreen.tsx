import React from "react";
import {
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from "react-native";
import {
    DEFAULT_SEPARATOR,
    FONT_SIZES,
    GLOBAL_STYLE,
    ICON_NAMES,
    SEPARATOR_SIZES
} from "../../Shared/constants/constants";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { theme } from "../../Shared/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../../Button/components/Button";
import {OpenBottomSheetArgs, useBottomSheet} from "../../BottomSheet/context/BottomSheetProvider";
import RegisterForm from "../../Form/layouts/register/RegisterForm";
import LoginForm from "../../Form/layouts/login/LoginForm";
import Icon from "../../Shared/components/Icon";
import Divider from "../../Shared/components/Divider";

const FirstScreen: React.FC = () => {
    const { openBottomSheet, closeBottomSheet  } = useBottomSheet();

    const bottomSheetArgs= {
        snapPoints: ["100%"],
        enableHandlePanningGesture: false,
        enableContentPanningGesture: false,
        closeButton:
            <View style={{ alignSelf: "center" }}>
                <Icon
                    icon={ ICON_NAMES.close }
                    size={ FONT_SIZES.medium }
                    color={ theme.colors.white }
                    onPress={ closeBottomSheet }
                />
            </View>
    } as Partial<OpenBottomSheetArgs>
    const openRegister = () => {
        openBottomSheet({
            ...bottomSheetArgs,
            title: "Felhasználó létrehozás",
            content:
                <RegisterForm
                    close={ closeBottomSheet }
                />
        });
    }
    const openLogin = () => {
        openBottomSheet({
            ...bottomSheetArgs,
            title: "Bejelentkezés",
            content:
                <LoginForm
                    close={ closeBottomSheet }
                />
        });
    };

    return (
        <SafeAreaView style={ styles.pageContainer }>
            <ImageBackground
                source={ require("../../../assets/images/home2.jpg") }
                style={ styles.imageContainer }
                imageStyle={ styles.imageContainer }
            >
                <LinearGradient
                    locations={ [ 0, 0.35, 0.85 ] }
                    colors={[
                        "transparent",
                        "rgba(0,0,0,0.25)",
                        theme.colors.black
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
                        onPress={ openRegister }
                    />
                    <Text style={ styles.underButtonText }>
                        Már rendelkezel felhasználóval ?
                        <Text
                            style={ styles.linkText }
                            onPress={ openLogin }
                        >
                            Jelentkezz be
                        </Text>
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        ...GLOBAL_STYLE.pageContainer,
        paddingBottom: 0,
        paddingVertical: 0,
    },
    imageContainer: {
        flex: 0.85
    },
    imageGradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        top: 20
    },
    image: {
        resizeMode: "stretch",
    },
    contentContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: theme.colors.black,
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
        letterSpacing: FONT_SIZES.extraLarge * 0.01,
        fontFamily: "Gilroy-Heavy",
        textTransform: "uppercase",
    },
    titleEffect: {
        zIndex: 0,
        position: "absolute", top: -hp(2.5),
        color: theme.colors.black,
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
        letterSpacing: FONT_SIZES.normal * 0.075
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
        letterSpacing: FONT_SIZES.small * 0.1,
        lineHeight: FONT_SIZES.small * 1.5,
        textAlign: "center",
    },
    linkText: {
        color: theme.colors.fuelYellow,
        textDecorationLine: "underline",
        fontSize: FONT_SIZES.small * 1.05,
        letterSpacing: FONT_SIZES.small * 1.05 * 0.05,
    }
})

export default FirstScreen;
