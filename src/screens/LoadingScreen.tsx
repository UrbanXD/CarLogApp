import React, { useEffect } from "react";
import { Href } from "expo-router";
import { StatusBar, StyleSheet, View } from "react-native";
import { COLORS } from "../constants/index.ts";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import Animated, {
    Easing,
    useAnimatedProps,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from "react-native-reanimated";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedIcon = Animated.createAnimatedComponent(MaterialIcon);

type LoadingScreenProps = {
    loaded: boolean
    redirectTo: Href
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ loaded, redirectTo }) => {
    const { top } = useSafeAreaInsets();
    const CAR_WIDTH = (564 / 3) / 1.35;
    const carOffset = useSharedValue(-CAR_WIDTH); // 0% - 100%
    const roadOffset = useSharedValue(0);
    const wheelRotation = useSharedValue(0);
    const engineStart = useSharedValue(0);
    const hasEntered = useSharedValue(false);
    const isLoaded = useSharedValue(false);

    const ENGINE_START_ANIMATION_DURATION = 1500;

    const ROAD_WIDTH = widthPercentageToDP(40);
    const ROAD_HEIGHT = heightPercentageToDP(1);
    const ROAD_ASPECT_RATIO = ROAD_WIDTH / ROAD_HEIGHT;
    const ROAD_ANIMATION_DURATION = 1000;
    const ROAD_STROKE_DASH = [20, 5];
    const ROAD_STROKE_DASH_VALUE = ROAD_STROKE_DASH[0] + ROAD_STROKE_DASH[1];

    const WHEEL_ANIMATION_DURATION = ROAD_ANIMATION_DURATION;
    const CAR_ANIMATION_DURATION = 1250;
    const CAR_HEIGHT = (188 / 3) / 1.35;
    const RIM_SIZE = CAR_WIDTH / 8;

    const startAnimation = () => {
        engineStart.value = withTiming(
            1,
            { duration: ENGINE_START_ANIMATION_DURATION },
            (finished) => {
                if(!finished) return;

                roadAnimation();
                carEnterAnimation();
                wheelAnimation();
            }
        );
    };

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
    const xd = widthPercentageToDP(75);

    const carExitAnimation = () => {
        "worklet";
        carOffset.value = withTiming(
            xd + CAR_WIDTH,
            { duration: CAR_ANIMATION_DURATION, easing: Easing.linear }
        );
    };

    useAnimatedReaction(
        () => hasEntered.value && isLoaded.value,
        (shouldRunExit) => {
            if(shouldRunExit) carExitAnimation();
        },
        []
    );

    const carEnterAnimation = () => {
        "worklet";
        carOffset.value = withTiming(
            (xd - CAR_WIDTH) / 2,
            { duration: CAR_ANIMATION_DURATION, easing: Easing.linear },
            (finished) => {
                if(finished) hasEntered.value = true;
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

    useEffect(() => {
        startAnimation();
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

    const styles = useStyles(top, CAR_WIDTH, CAR_HEIGHT, RIM_SIZE);

    return (
        // loaded
        // ? <Redirect href={ redirectTo }/>
        // :
        <View style={ styles.container }>
            <StatusBar barStyle="light-content" backgroundColor={ styles.container.backgroundColor }/>
            <View style={ [
                styles.loadingContainer
            ] }
            >
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
                            strokeWidth={ heightPercentageToDP(0.20) }
                            strokeDasharray={ `${ ROAD_STROKE_DASH[0] },${ ROAD_STROKE_DASH[1] }` }
                            animatedProps={ roadAnimatedProps }
                            stroke={ COLORS.white }
                            fill="none"
                        />
                    </Svg>
                </View>
            </View>
        </View>
    );
};

const useStyles = (top: number, carWidth: number, carHeight: number, rimSize: number) => StyleSheet.create({
    container: {
        flex: 1,
        marginTop: top,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.black2
    },
    loadingContainer: {
        width: widthPercentageToDP(75),
        height: carHeight + heightPercentageToDP(1),
        gap: heightPercentageToDP(0.35),
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
    }

});

export default LoadingScreen;