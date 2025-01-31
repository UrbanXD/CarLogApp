import React from "react";
import Animated, {FadeInLeft} from "react-native-reanimated";
import {StyleSheet, Text} from "react-native";
import {FONT_SIZES, GLOBAL_STYLE, SEPARATOR_SIZES} from "../../../constants/constants";
import {theme} from "../../../constants/theme";

const WelcomeBlock: React.FC = () =>
    <Animated.View
        entering={ FadeInLeft.springify(1200) }
        style={ styles.titleContainer }
    >
        <Text style={ styles.welcomeText }>
            Üdv Urbán Ádám!
        </Text>
        <Text style={ styles.infoText }>
            Vezzessen számot nálunk az autóiról!
        </Text>
    </Animated.View>

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
        fontSize: FONT_SIZES.medium,
        letterSpacing: FONT_SIZES.medium * 0.045,
        color: theme.colors.white,
        textTransform: "uppercase"
    },
    infoText: {
        fontFamily: "Gilroy-Mediun",
        fontSize: FONT_SIZES.intermediate,
        letterSpacing: FONT_SIZES.intermediate * 0.05,
        color: theme.colors.gray1
    },
})

export default WelcomeBlock;