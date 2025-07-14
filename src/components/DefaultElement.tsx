import React, { useState } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { COLORS, FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../constants/index.ts";
import Icon from "./Icon";
import { hexToRgba } from "../utils/colors/hexToRgba";
import { ImageSource } from "../types/index.ts";
import CarLoadingIndicator from "./loading/CarLoadingIndicator.tsx";
import Animated, { FadeInLeft } from "react-native-reanimated";

interface DefaultElementProps {
    loading?: boolean;
    icon?: ImageSource;
    text?: string;
    loadingText?: string;
    style?: ViewStyle;
}

const DefaultElement: React.FC<DefaultElementProps> = ({
    loading = false,
    icon = ICON_NAMES.image,
    text,
    loadingText = "Adatok betöltése",
    style
}) => {
    const [loadingAnimationFinished, setLoadingAnimationFinished] = useState(!loading);

    return (
        <View style={ [styles.container, style] }>
            {
                !loadingAnimationFinished
                ? <CarLoadingIndicator
                    loaded={ !loading }
                    loadingText={ loadingText }
                    onAnimationFinished={ () => setLoadingAnimationFinished(true) }
                />
                : <Animated.View
                    style={ { alignItems: "center" } }
                    entering={
                        loading !== loadingAnimationFinished
                        ? undefined
                        : FadeInLeft.duration(300)
                    }
                >
                    <Icon
                        icon={ icon }
                        size={ FONT_SIZES.title }
                        color={ COLORS.gray3 }
                    />
                    {
                        text &&
                       <Text style={ styles.text }>{ text }</Text>
                    }
                </Animated.View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        flexDirection: "column",
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: hexToRgba(COLORS.gray5, 0.65),
        borderWidth: 0.5,
        borderRadius: 38,
        borderColor: COLORS.gray5,
        paddingHorizontal: SEPARATOR_SIZES.small,
        overflow: "hidden"
    },
    text: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p2,
        letterSpacing: FONT_SIZES.p2 * 0.025,
        lineHeight: FONT_SIZES.p2 * 1.25,
        color: COLORS.gray2,
        textAlign: "center"
    }
});

export default DefaultElement;