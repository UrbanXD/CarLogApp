import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { COLORS, DEFAULT_SEPARATOR } from "../constants/index.ts";
import AnimatedStrokePath from "./svg/AnimatedStrokePath.tsx";
import { AnimatedSvg } from "./AnimatedComponents/index.ts";

type TitleProps = {
    animated?: boolean
    onAnimationFinished?: () => void
}

const CarlogTitle: React.FC<TitleProps> = ({
    animated = true,
    onAnimationFinished
}) => {
    // CARLOG - SVG PATH
    const VIEW_BOX_WIDTH = 144;
    const VIEW_BOX_HEIGHT = 27;
    const WIDTH = Math.min(450, Dimensions.get("window").width - 2 * DEFAULT_SEPARATOR); // maxWidth = 400
    const HEIGHT = (VIEW_BOX_HEIGHT / VIEW_BOX_WIDTH) * WIDTH + 12;
    const PATHS = [
        "M14.076 26.576C10.26 26.576 7.128 25.316 4.644 22.796C2.124 20.276 0.9 17.144 0.9 13.4C0.9 9.656 2.124 6.524 4.644 4.004C7.128 1.484 10.26 0.223999 14.076 0.223999C16.38 0.223999 18.54 0.799998 20.52 1.88C22.464 2.996 24.012 4.472 25.128 6.344L18.864 9.944C18.432 9.152 17.82 8.504 16.956 8C16.092 7.532 15.12 7.28 14.076 7.28C12.276 7.28 10.836 7.856 9.756 9.008C8.64 10.16 8.1 11.636 8.1 13.4C8.1 15.2 8.64 16.64 9.756 17.792C10.836 18.944 12.276 19.52 14.076 19.52C15.156 19.52 16.092 19.304 16.956 18.8C17.82 18.332 18.432 17.684 18.864 16.82L25.128 20.42C24.012 22.328 22.464 23.84 20.52 24.92C18.54 26.036 16.38 26.576 14.076 26.576Z",
        "M41.5167 26L40.6527 22.76H33.3807L32.5167 26H24.7767L32.8047 0.799998H41.2287L49.2567 26H41.5167ZM34.9287 17H39.1047L37.0167 9.26L34.9287 17Z",
        "M63.6983 25.964L59.7023 18.044H57.9023V25.964H50.7023V0.763999H60.7823C63.5183 0.763999 65.8223 1.592 67.6223 3.212C69.4223 4.832 70.3223 6.956 70.3223 9.62C70.3223 11.132 69.9623 12.464 69.2783 13.652C68.5943 14.876 67.6583 15.848 66.4343 16.568L71.4023 25.964H63.6983ZM57.9023 7.388V12.068H60.6383C61.3943 12.104 62.0063 11.924 62.4383 11.492C62.8703 11.096 63.1223 10.52 63.1223 9.764C63.1223 9.044 62.8703 8.468 62.4383 8.036C62.0063 7.604 61.3943 7.388 60.6383 7.388H57.9023Z",
        "M80.4023 19.016H88.6823V26H73.2023V0.799998H80.4023V19.016Z",
        "M102.217 26.576C98.4729 26.576 95.3049 25.316 92.7129 22.796C90.1209 20.276 88.8609 17.144 88.8609 13.4C88.8609 9.692 90.1209 6.56 92.7129 4.04C95.3049 1.52 98.4729 0.223999 102.217 0.223999C105.961 0.223999 109.093 1.52 111.685 4.04C114.277 6.56 115.573 9.692 115.573 13.4C115.573 17.144 114.277 20.276 111.685 22.796C109.093 25.316 105.961 26.576 102.217 26.576ZM102.217 19.52C103.981 19.52 105.457 18.944 106.609 17.792C107.761 16.64 108.373 15.164 108.373 13.4C108.373 11.672 107.761 10.196 106.609 9.044C105.457 7.892 103.981 7.28 102.217 7.28C100.417 7.28 98.9409 7.892 97.7889 9.044C96.6369 10.196 96.0609 11.672 96.0609 13.4C96.0609 15.164 96.6369 16.64 97.7889 17.792C98.9409 18.944 100.417 19.52 102.217 19.52Z",
        "M143.365 11.132V14.12C143.365 17.72 142.177 20.708 139.873 23.048C137.569 25.424 134.509 26.576 130.765 26.576C126.805 26.576 123.601 25.352 121.117 22.832C118.597 20.312 117.373 17.18 117.373 13.436C117.373 9.692 118.597 6.56 121.117 4.04C123.601 1.52 126.733 0.223999 130.477 0.223999C132.817 0.223999 134.977 0.763999 136.921 1.808C138.865 2.888 140.413 4.292 141.565 6.092L135.445 9.584C134.437 8.072 132.817 7.28 130.621 7.28C128.821 7.28 127.345 7.856 126.229 9.008C125.113 10.16 124.573 11.672 124.573 13.472C124.573 15.2 125.077 16.712 126.121 18.008C127.129 19.304 128.749 19.916 130.909 19.916C133.393 19.916 135.049 19.052 135.913 17.252H130.549V11.132H143.365Z"
    ];

    const DURATION_TEXT_EFFECT_1 = 300;
    const DURATION_TEXT_EFFECT_2 = 2 * DURATION_TEXT_EFFECT_1;
    const GOAL_Y_TRANSLATE_TEXT_EFFECT_1 = HEIGHT / 1.75;
    const GOAL_Y_TRANSLATE_TEXT_EFFECT_2 = 2 * GOAL_Y_TRANSLATE_TEXT_EFFECT_1;

    const CONTAINER_HEIGHT = HEIGHT + GOAL_Y_TRANSLATE_TEXT_EFFECT_2 + VIEW_BOX_HEIGHT;
    const CONTAINER_DEFAULT_TRANSLATE_X = (WIDTH / 2) - (VIEW_BOX_WIDTH / 4);

    const translateYTextEffect1 = useSharedValue(0);
    const translateYTextEffect2 = useSharedValue(0);
    const containerTranslateX = useSharedValue(CONTAINER_DEFAULT_TRANSLATE_X);

    const startTextEffectAnimation = () => {
        "worklet";
        if(!animated) return;

        translateYTextEffect1.value = withTiming(
            GOAL_Y_TRANSLATE_TEXT_EFFECT_1,
            { duration: DURATION_TEXT_EFFECT_1 }
        );

        translateYTextEffect2.value = withTiming(
            GOAL_Y_TRANSLATE_TEXT_EFFECT_2,
            { duration: DURATION_TEXT_EFFECT_2 },
            finished => {
                if(finished && onAnimationFinished) onAnimationFinished();
            }
        );
    };

    const onLetterAnimationProgress = (letterVisibleWidth: number) => {
        "worklet";
        if(!animated) return;
        containerTranslateX.value = Math.max(0, containerTranslateX.value - letterVisibleWidth / 2);
    };

    const primaryTextContainerStyle = useAnimatedStyle(() => {
        const translateX = animated ? containerTranslateX.value : 0;

        return {
            transform: [{ translateX }]
        };
    });

    const textEffect1Style = useAnimatedStyle(() => {
        const translateY = animated ? translateYTextEffect1.value : GOAL_Y_TRANSLATE_TEXT_EFFECT_1;

        return {
            transform: [{ translateY }],
            display: translateY === 0 ? "none" : "flex",
            zIndex: 0
        };
    });

    const textEffect2Style = useAnimatedStyle(() => {
        const translateY = animated ? translateYTextEffect2.value : GOAL_Y_TRANSLATE_TEXT_EFFECT_2;

        return {
            transform: [{ translateY }],
            display: translateY === 0 ? "none" : "flex",
            zIndex: -1
        };
    });

    return (
        <View style={ {
            height: CONTAINER_HEIGHT,
            width: WIDTH,
            alignSelf: "center",
            transform: [{ translateY: -VIEW_BOX_HEIGHT }]
        } }>
            <AnimatedSvg
                width={ WIDTH }
                height={ HEIGHT }
                viewBox={ `0 0 ${ VIEW_BOX_WIDTH } ${ VIEW_BOX_HEIGHT }` }
                style={ [styles.text, primaryTextContainerStyle] }
            >
                {
                    PATHS.map((path, index) => (
                        <AnimatedStrokePath
                            key={ index }
                            delay={ 150 * index }
                            disabled={ !animated || index === 0 }
                            onAnimateFinish={ (PATHS.length - 1 === index) ? startTextEffectAnimation : undefined }
                            onAnimationProgress={ onLetterAnimationProgress }
                            pathProps={ {
                                d: path
                            } }
                        />
                    ))
                }
            </AnimatedSvg>
            <AnimatedSvg
                width={ WIDTH }
                height={ HEIGHT }
                viewBox={ `0 0 ${ VIEW_BOX_WIDTH } ${ VIEW_BOX_HEIGHT }` }
                style={ [styles.text, styles.text.effect, textEffect1Style] }
            >
                {
                    PATHS.map((path, index) => (
                        <AnimatedStrokePath
                            key={ index }
                            disabled={ true }
                            pathProps={ {
                                d: path,
                                fill: COLORS.black2,
                                stroke: COLORS.gray2,
                                strokeWidth: 0.35
                            } }
                        />
                    ))
                }
            </AnimatedSvg>
            <AnimatedSvg
                width={ WIDTH }
                height={ HEIGHT }
                viewBox={ `0 0 ${ VIEW_BOX_WIDTH } ${ VIEW_BOX_HEIGHT }` }
                style={ [styles.text, styles.text.effect, textEffect2Style] }
            >
                {
                    PATHS.map((path, index) => (
                        <AnimatedStrokePath
                            key={ index }
                            disabled={ true }
                            pathProps={ {
                                d: path,
                                fill: COLORS.black2,
                                stroke: COLORS.gray2,
                                strokeWidth: 0.35
                            } }
                        />
                    ))
                }
            </AnimatedSvg>
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        zIndex: 1,
        alignSelf: "center",

        effect: { position: "absolute" }
    }
});

export default CarlogTitle;