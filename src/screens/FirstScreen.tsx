import React from "react";
import {Image, ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {GLOBAL_STYLE} from "../constants/constants";
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
            {/*<StatusBar translucent={false} backgroundColor='transparent' />*/}
            {/*<StatusBar barStyle="light-content" translucent={true}  backgroundColor={ theme.colors.primaryBackground3 }  />*/}
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
                    <Text style={ [styles.title, styles.titleEffect, { top: 20, zIndex: -1 }] }>Carlog</Text>
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
        paddingHorizontal: 20,
        gap: hp(7.5)
    },
    title: {
        zIndex: 1,
        top: hp(90 / -12),
        alignSelf: "center",
        color: theme.colors.white,
        fontSize: 90,
        letterSpacing: 90 * 0.01,
        fontFamily: "Gilroy-Heavy",
        textTransform: "uppercase",
    },
    titleEffect: {
        zIndex: 0,
        position: "absolute", top: -20,
        color: theme.colors.primaryBackground3,
        textShadowOffset: {height: 0, width: 0},
        textShadowColor: theme.colors.white,
        textShadowRadius: 1,
        textAlign: "center",
    },
    divider: {
        alignSelf: "center",
        backgroundColor: theme.colors.fuelYellow,
        height: 2,
        width: wp(60)
    },
    subtitle: {
        alignSelf: "center",
        color: theme.colors.secondaryColor2,
        fontSize: 22,
        fontFamily: "Gilroy-Medium",
        textTransform: "uppercase",
        letterSpacing: 22 * 0.075
        // fontWeight: "bold"
    },
    actionContainer: {
        flexDirection: "column",
        gap: 20
    },
    underButtonText:{
        color: theme.colors.white,
        alignSelf: "center",
        fontFamily: "Gilroy-Medium",
        fontSize: 18,
        letterSpacing: 18 * 0.1,
        lineHeight: 18 * 1.5,
        textAlign: "center",
    },
    linkText: {
        color: theme.colors.fuelYellow,
        textDecorationLine: "underline",
        fontSize: 19,
        letterSpacing: 19 * 0.05,
    }
})

export default FirstScreen;