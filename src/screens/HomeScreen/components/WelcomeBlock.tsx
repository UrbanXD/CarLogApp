import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, GLOBAL_STYLE } from "../../../constants/index.ts";
import { useAuth } from "../../../contexts/Auth/AuthContext.ts";

const WelcomeBlock: React.FC = () => {
    const { user } = useAuth();

    return (
        <View
            style={ styles.titleContainer }
        >
            <Text style={ styles.welcomeText }>
                Üdv { `${ user?.firstname ?? "" } ${ user?.lastname ?? "" }` }!
            </Text>
            <Text style={ styles.infoText }>
                Vezzessen számot nálunk az autóiról!
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        ...GLOBAL_STYLE.contentContainer,
        paddingHorizontal: 0,
        paddingVertical: 0,
        gap: 0,
        backgroundColor: "transparent"
    },
    welcomeText: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.h2,
        letterSpacing: FONT_SIZES.h2 * 0.045,
        color: COLORS.white,
        textTransform: "uppercase"
    },
    infoText: {
        fontFamily: "Gilroy-Mediun",
        fontSize: FONT_SIZES.p2,
        letterSpacing: FONT_SIZES.p2 * 0.05,
        color: COLORS.gray1
    }
})

export default WelcomeBlock;