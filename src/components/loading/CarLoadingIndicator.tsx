import React, { useEffect, useState } from "react";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../constants/index.ts";
import Animated, {
    Easing,
    runOnJS,
    runOnUI,
    useAnimatedProps,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from "react-native-reanimated";
import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import BounceDot from "./BounceDot.tsx";
import { AnimatedPath, AnimatedSvg } from "../AnimatedComponents/index.ts";
import { useTranslation } from "react-i18next";

type CarLoadingIndicatorProps = {
    loaded: boolean,
    loadingText?: string
    onAnimationFinished?: () => void
}

const CarLoadingIndicator: React.FC<CarLoadingIndicatorProps> = ({
    loaded,
    loadingText,
    onAnimationFinished
}) => {
    const { t } = useTranslation();

    const ROAD_HEIGHT = hp(0.25);
    const ROAD_ANIMATION_DURATION = 1000;
    const ROAD_STROKE_DASH = [20, 5];
    const ROAD_STROKE_DASH_VALUE = ROAD_STROKE_DASH[0] + ROAD_STROKE_DASH[1];

    const CAR_WIDTH = (564 / 3) / 1.5;
    const CAR_HEIGHT = (188 / 3) / 1.5;
    const RIM_SIZE = CAR_WIDTH / 8;
    const WHEEL_ANIMATION_DURATION = ROAD_ANIMATION_DURATION * 1.5;
    const CAR_ANIMATION_DURATION = WHEEL_ANIMATION_DURATION * 1.15;

    const [roadPathD, setRoadPathD] = useState("");
    const [roadViewBox, setRoadViewBox] = useState("");

    const roadWidth = useSharedValue(0);
    const roadOffset = useSharedValue(0);
    const carOffset = useSharedValue(-CAR_WIDTH); // vlahogy a roadWidthhel megoldani mert igy nem kivulrol jon ha nagy az ut
    const wheelRotation = useSharedValue(0);
    const hasEntered = useSharedValue(false);
    const isLoaded = useSharedValue(false);

    const roadAnimation = () => {
        "worklet";
        roadOffset.value = withRepeat(
            withTiming(
                ROAD_STROKE_DASH_VALUE,
                { duration: ROAD_ANIMATION_DURATION, easing: Easing.linear }
            ),
            -1
        );
    };

    const carEnterAnimation = () => {
        "worklet";
        carOffset.value = withTiming(
            (roadWidth.value - CAR_WIDTH) / 2,
            { duration: CAR_ANIMATION_DURATION, easing: Easing.linear },
            (finished) => {
                if(finished) hasEntered.value = true;
            }
        );
    };

    const carExitAnimation = () => {
        "worklet";
        carOffset.value = withTiming(
            roadWidth.value,
            { duration: CAR_ANIMATION_DURATION, easing: Easing.linear },
            finished => {
                if(finished && onAnimationFinished) runOnJS(onAnimationFinished)();
            }
        );
    };

    const wheelAnimation = () => {
        "worklet";
        wheelRotation.value = withRepeat(
            withTiming(
                360,
                { duration: WHEEL_ANIMATION_DURATION, easing: Easing.linear }
            ),
            -1
        );
    };

    useAnimatedReaction(
        () => roadWidth.value,
        (roadWidthValue) => {
            const newRoadPathD = `M0,${ ROAD_HEIGHT / 2 } L${ roadWidthValue },${ ROAD_HEIGHT / 2 }`;
            runOnJS(setRoadPathD)(newRoadPathD);

            const newRoadViewBox = `0 0 ${ roadWidth.value } ${ ROAD_HEIGHT }`;
            runOnJS(setRoadViewBox)(newRoadViewBox);
        }
    );

    useAnimatedReaction(
        () => hasEntered.value && isLoaded.value,
        (shouldRunExit) => {
            if(shouldRunExit) carExitAnimation();
        },
        []
    );

    useEffect(() => {
        if(loaded) isLoaded.value = true;
    }, [loaded]);

    const startAnimation = () => {
        "worklet";
        roadAnimation();
        carEnterAnimation();
        wheelAnimation();
    };

    const onContainerLayout = (event: LayoutChangeEvent) => {
        const newWidth = event.nativeEvent.layout.width;
        if(newWidth === roadWidth.value) return;

        roadWidth.value = newWidth;
        if(newWidth !== 0) runOnUI(startAnimation)();
    };

    const roadSvgAnimatedProps = useAnimatedProps(() => {
        return {
            width: roadWidth.value,
            height: ROAD_HEIGHT
        };
    });

    const roadAnimatedProps = useAnimatedProps(() => {
        return {
            strokeDashoffset: roadOffset.value
        };
    });

    const loadingContainerStyle = useAnimatedStyle(() => {
        return {
            width: roadWidth.value,
            height: CAR_HEIGHT + ROAD_HEIGHT * 2
        };
    });

    const carStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: carOffset.value }]
        };
    });

    const rimStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${ wheelRotation.value } deg` }]
        };
    });

    const styles = useStyles(CAR_WIDTH, CAR_HEIGHT, RIM_SIZE);

    return (
        <View style={ styles.container } onLayout={ onContainerLayout }>
            <Animated.View style={ [styles.loadingContainer, loadingContainerStyle] }>
                <Animated.View style={ [styles.car, carStyle] }>
                    <Animated.Image
                        source={ require("../../assets/images/car_body.png") }
                        resizeMode="stretch"
                        style={ styles.car.body }
                    />
                    <Animated.Image
                        source={ require("../../assets/images/rim.png") }
                        resizeMode="contain"
                        style={ [
                            styles.car.rim,
                            { left: (CAR_WIDTH - RIM_SIZE) / 6 },
                            rimStyle
                        ] }
                    />
                    <Animated.Image
                        source={ require("../../assets/images/rim.png") }
                        resizeMode="contain"
                        style={ [
                            styles.car.rim,
                            { right: RIM_SIZE - RIM_SIZE / 8 },
                            rimStyle
                        ] }
                    />
                </Animated.View>
                <AnimatedSvg animatedProps={ roadSvgAnimatedProps } viewBox={ roadViewBox }>
                    <AnimatedPath
                        d={ roadPathD }
                        animatedProps={ roadAnimatedProps }
                        strokeWidth={ ROAD_HEIGHT }
                        strokeDasharray={ ROAD_STROKE_DASH }
                        stroke={ COLORS.white }
                        fill="none"
                    />
                </AnimatedSvg>
            </Animated.View>
            <View style={ styles.loadingTextContainer }>
                <Text style={ styles.loadingTextContainer.text }>{ loadingText ?? t("common.loading") }</Text>
                <BounceDot delay={ 0 }/>
                <BounceDot delay={ 200 }/>
                <BounceDot delay={ 400 }/>
            </View>
        </View>
    );
};

const useStyles = (
    carWidth: number,
    carHeight: number,
    rimSize: number
) => StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: SEPARATOR_SIZES.lightSmall
    },
    loadingContainer: {
        gap: hp(0.35),
        overflow: "hidden"
    },
    car: {
        position: "relative",
        width: carWidth,
        height: carHeight,

        body: {
            position: "absolute",
            width: "100%",
            height: "100%"
        },

        rim: {
            position: "absolute",
            bottom: rimSize / 7,
            width: rimSize,
            height: rimSize
        }
    },
    loadingTextContainer: {
        flexDirection: "row",

        text: {
            fontFamily: "Gilroy-Heavy",
            fontSize: FONT_SIZES.p1,
            color: COLORS.gray1
        }
    }
});

export default React.memo(CarLoadingIndicator);