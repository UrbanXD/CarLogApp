import React, { useEffect } from "react";
import { Href, router } from "expo-router";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { COLORS, DEFAULT_SEPARATOR, FONT_SIZES, SEPARATOR_SIZES } from "../constants/index.ts";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
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
import BounceDot from "../components/BounceDot.tsx";

const AnimatedPath = Animated.createAnimatedComponent(Path);

type LoadingScreenProps = {
    loaded: boolean
    redirectTo: Href
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ loaded, redirectTo }) => {
    const { top } = useSafeAreaInsets();

    const ANIMATION_CONTAINER_WIDTH = wp(100) - 2 * DEFAULT_SEPARATOR;

    const ROAD_WIDTH = wp(40);
    const ROAD_HEIGHT = hp(1);
    const ROAD_ASPECT_RATIO = ROAD_WIDTH / ROAD_HEIGHT;
    const ROAD_ANIMATION_DURATION = 1000;
    const ROAD_STROKE_DASH = [20, 5];
    const ROAD_STROKE_DASH_VALUE = ROAD_STROKE_DASH[0] + ROAD_STROKE_DASH[1];

    const CAR_WIDTH = (564 / 3) / 1.35;
    const CAR_HEIGHT = (188 / 3) / 1.35;
    const RIM_SIZE = CAR_WIDTH / 8;
    const WHEEL_ANIMATION_DURATION = ROAD_ANIMATION_DURATION * 1.35;
    const CAR_ANIMATION_DURATION = WHEEL_ANIMATION_DURATION;

    const carOffset = useSharedValue(-CAR_WIDTH);
    const roadOffset = useSharedValue(0);
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
            (ANIMATION_CONTAINER_WIDTH - CAR_WIDTH) / 2,
            { duration: CAR_ANIMATION_DURATION, easing: Easing.linear },
            (finished) => {
                if(finished) hasEntered.value = true;
            }
        );
    };

    const carExitAnimation = () => {
        "worklet";
        carOffset.value = withTiming(
            ANIMATION_CONTAINER_WIDTH,
            { duration: CAR_ANIMATION_DURATION, easing: Easing.linear },
            (finished) => {
                if(finished) runOnJS(router.replace)(redirectTo);
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
        () => hasEntered.value && isLoaded.value,
        (shouldRunExit) => {
            if(shouldRunExit) carExitAnimation();
        },
        []
    );

    useEffect(() => {
        runOnUI(roadAnimation)();
        runOnUI(carEnterAnimation)();
        runOnUI(wheelAnimation)();
    }, []);

    useEffect(() => {
        if(loaded) isLoaded.value = true;
    }, [loaded]);

    const roadAnimatedProps = useAnimatedProps(() => {
        return {
            strokeDashoffset: roadOffset.value
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

    const styles = useStyles(top, ANIMATION_CONTAINER_WIDTH, CAR_WIDTH, CAR_HEIGHT, RIM_SIZE);

    return (
        <View style={ styles.container }>
            <StatusBar barStyle="light-content" backgroundColor={ styles.container.backgroundColor }/>
            <View style={ styles.loadingContainer }>
                <Animated.View style={ [styles.car, carStyle] }>
                    <Animated.Image
                        source={ require("../assets/images/kocsi.png") }
                        resizeMode="stretch"
                        style={ styles.car.body }
                    />
                    <Animated.Image
                        source={ require("../assets/images/felni.png") }
                        resizeMode="contain"
                        style={ [
                            styles.car.rim,
                            { left: (CAR_WIDTH - RIM_SIZE) / 6 },
                            rimStyle
                        ] }
                    />
                    <Animated.Image
                        source={ require("../assets/images/felni.png") }
                        resizeMode="contain"
                        style={ [
                            styles.car.rim,
                            { right: RIM_SIZE - RIM_SIZE / 8 },
                            rimStyle
                        ] }
                    />
                </Animated.View>
                <View style={ { aspectRatio: ROAD_ASPECT_RATIO } }>
                    <Svg
                        width="100%"
                        height="100%"
                        viewBox={ `0 0 ${ ROAD_WIDTH } ${ ROAD_HEIGHT }` }
                    >
                        <AnimatedPath
                            d={ `M0,0 L${ ROAD_WIDTH },0` }
                            strokeWidth={ hp(0.20) }
                            strokeDasharray={ `${ ROAD_STROKE_DASH[0] },${ ROAD_STROKE_DASH[1] }` }
                            animatedProps={ roadAnimatedProps }
                            stroke={ COLORS.white }
                            fill="none"
                        />
                    </Svg>
                </View>
            </View>
            <View style={ styles.loadingTextContainer }>
                <Text style={ styles.loadingTextContainer.text }>Betöltés</Text>
                <BounceDot delay={ 0 }/>
                <BounceDot delay={ 200 }/>
                <BounceDot delay={ 400 }/>
            </View>
        </View>
    );
};

const useStyles = (
    top: number,
    animationContainerWidth: number,
    carWidth: number,
    carHeight: number,
    rimSize: number
) => StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: SEPARATOR_SIZES.lightSmall,
        backgroundColor: COLORS.black2,
        marginTop: top
    },
    loadingContainer: {
        width: animationContainerWidth,
        height: carHeight + hp(1),
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

export default LoadingScreen;