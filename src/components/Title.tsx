import React, { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { COLORS, FONT_SIZES } from "../constants/index.ts";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { router } from "expo-router";

type TitleProps = {
    text: string
    redirectTo?: string
    loaded?: boolean
    withEffect?: boolean
    animated?: boolean
}

const Title: React.FC<TitleProps> = ({
    text,
    redirectTo,
    loaded,
    withEffect = true,
    animated
}) => {
    const translateYTextEffect1 = useSharedValue(0);
    const translateYTextEffect2 = useSharedValue(0);

    const DELAY_TEXT_EFFECT = 250;
    const DURATION_TEXT_EFFECT_1 = 300;
    const DURATION_TEXT_EFFECT_2 = 2 * DURATION_TEXT_EFFECT_1;
    const GOAL_Y_TRANSLATE_TEXT_EFFECT_1 = heightPercentageToDP(5);
    const GOAL_Y_TRANSLATE_TEXT_EFFECT_2 = 2 * GOAL_Y_TRANSLATE_TEXT_EFFECT_1;

    useEffect(() => {
        if(!animated && !withEffect) return;

        translateYTextEffect1.value = withDelay(
            DELAY_TEXT_EFFECT,
            withTiming(
                GOAL_Y_TRANSLATE_TEXT_EFFECT_1,
                { duration: DURATION_TEXT_EFFECT_1 }
            )
        );

        translateYTextEffect2.value = withDelay(
            DELAY_TEXT_EFFECT,
            withTiming(
                GOAL_Y_TRANSLATE_TEXT_EFFECT_2,
                { duration: DURATION_TEXT_EFFECT_2 },
                (finished) => {
                    if(finished && redirectTo) runOnJS(router.replace)(redirectTo);
                }
            )
        );
    }, []);

    const textEffect1Style = useAnimatedStyle(() => {
        if(!withEffect) return {};

        const translateY = animated ? translateYTextEffect1.value : GOAL_Y_TRANSLATE_TEXT_EFFECT_1;

        return {
            transform: [{ translateY }],
            zIndex: 0
        };
    });

    const textEffect2Style = useAnimatedStyle(() => {
        if(!withEffect) return {};

        const translateY = animated ? translateYTextEffect2.value : GOAL_Y_TRANSLATE_TEXT_EFFECT_2;

        return {
            transform: [{ translateY }],
            zIndex: -1
        };
    });

    return (
        <>
            <Text style={ styles.text } adjustsFontSizeToFit numberOfLines={ 1 }>
                { text }
            </Text>
            {
                withEffect &&
               <>
                  <Animated.Text
                     style={ [
                         styles.text,
                         styles.text.effect,
                         textEffect1Style
                     ] }
                     adjustsFontSizeToFit
                     numberOfLines={ 1 }
                  >
                      { text }
                  </Animated.Text>
                  <Animated.Text
                     style={ [
                         styles.text,
                         styles.text.effect,
                         textEffect2Style
                     ] }
                     adjustsFontSizeToFit
                     numberOfLines={ 1 }
                  >
                      { text }
                  </Animated.Text>
               </>
            }
        </>
    );
};

const styles = StyleSheet.create({
    text: {
        zIndex: 1,
        top: heightPercentageToDP(FONT_SIZES.title / -12),
        alignSelf: "center",
        color: COLORS.white,
        fontSize: FONT_SIZES.title,
        fontFamily: "Gilroy-Heavy",
        textTransform: "uppercase",

        effect: {
            position: "absolute",
            color: COLORS.black2,
            textShadowOffset: { height: 0, width: 0 },
            textShadowColor: COLORS.white,
            textShadowRadius: 1
        }
    }
});

export default Title;