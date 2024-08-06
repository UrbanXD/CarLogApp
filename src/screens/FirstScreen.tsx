import React from "react";
import {Image, ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {FONT_SIZES, GLOBAL_STYLE, SEPARATOR_SIZES} from "../constants/constants";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import {theme} from "../styles/theme";
import {LinearGradient} from "expo-linear-gradient";
import {Divider} from "react-native-paper";
import {router} from "expo-router";
import Button from "../components/Button/Button";

const FirstScreen: React.FC = () => {
    const openRegister = () => router.push({ pathname: "/(user_entry)/register" });
    const openLogin = () => router.push({ pathname: "/(user_entry)/login" });
    return (
        <View style={ [GLOBAL_STYLE.pageContainer, { gap: 0 }] }>
            <ImageBackground source={ require("../assets/home2.jpg") } style={ styles.imageContainer } imageStyle={ styles.imageContainer }>
                <LinearGradient
                    locations={[ 0, 0.35, 0.85 ]}
                    colors={ ["transparent", "rgba(0,0,0,0.25)", theme.colors.primaryBackground3] }
                    style={{ ...StyleSheet.absoluteFillObject, top: 10 }}
                />
            </ImageBackground>
            <View style={ styles.contentContainer }>
                <View style={{ top: -40, gap: 20 }}>
                    <Text style={ styles.title }>Carlog</Text>
                    <Text style={ [styles.title, styles.titleEffect] }>Carlog</Text>
                    <Text style={ [styles.title, styles.titleEffect, { top: hp(2.5), zIndex: -1 }] }>Carlog</Text>
                    <Divider style={ styles.divider } />
                    <Text style={ styles.subtitle }>Kezelje nálunk autóit</Text>
                </View>
                <View style={ styles.actionContainer }>
                    <Button title="Regisztráció" onPress={ openRegister }/>
                    <Text style={ styles.underButtonText }>
                        Már rendelkezel felhasználóval ?
                        <Text style={ styles.linkText } onPress={ openLogin } >Jelentkezz be</Text>
                    </Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
        flex: 0.5,
    },
    image: {
        resizeMode: "cover",
    },
    contentContainer: {
        flex: 0.5,
        flexDirection: "column",
        backgroundColor: theme.colors.primaryBackground3,
        paddingHorizontal: SEPARATOR_SIZES.normal,
        gap: SEPARATOR_SIZES.large
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
        color: theme.colors.primaryBackground3,
        textShadowOffset: { height: 0, width: 0 },
        textShadowColor: theme.colors.white,
        textShadowRadius: 1,
        textAlign: "center",
    },
    divider: {
        alignSelf: "center",
        backgroundColor: theme.colors.fuelYellow,
        height: 2,
        width: wp(70)
    },
    subtitle: {
        alignSelf: "center",
        color: theme.colors.secondaryColor2,
        fontSize: FONT_SIZES.normal,
        fontFamily: "Gilroy-Medium",
        textTransform: "uppercase",
        letterSpacing: FONT_SIZES.normal * 0.075
        // fontWeight: "bold"
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