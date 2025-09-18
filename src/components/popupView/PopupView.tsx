import { ReactNode } from "react";
import Animated, {
    interpolate,
    SharedValue,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from "react-native-reanimated";
import { StyleSheet, View, ViewStyle } from "react-native";
import { DEFAULT_SEPARATOR } from "../../constants/index.ts";
import { Overlay } from "../overlay/Overlay.tsx";
import { Portal } from "@gorhom/portal";

type PopupViewProps = {
    opened: SharedValue<boolean>
    children?: ReactNode
    style?: ViewStyle
}

const SPRING_CONFIG = {
    duration: 900,
    overshootClamping: true,
    dampingRatio: 0.8
};

export function PopupView({ opened, children, style }: PopupViewProps) {
    const popupDisplay = useSharedValue<"flex" | "none">("none");

    useAnimatedReaction(
        () => opened.value,
        (isOpened) => {
            if(isOpened) popupDisplay.value = "flex";
        }
    );

    const close = () => opened.value = false;

    const popupStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(Number(opened.value), [0, 1], [1.15, 1]);
        const scale = withSpring(scaleValue, SPRING_CONFIG, (finished) => {
            if(finished && !opened.value) popupDisplay.value = "none";
        });

        const opacity = withTiming(Number(opened.value), { duration: SPRING_CONFIG.duration / 2 });

        return { display: popupDisplay.value, opacity, transform: [{ scale }] };
    });

    return (
        <Portal hostName="popup">
            <Overlay opened={ opened } onPress={ close }/>
            <View style={ styles.container } pointerEvents="box-none">
                <Animated.View style={ [popupStyle, styles.popup, style] }>
                    { children }
                </Animated.View>
            </View>
        </Portal>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        zIndex: 3,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: DEFAULT_SEPARATOR
    },
    popup: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    }
});