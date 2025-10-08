import { ReactNode, useState } from "react";
import Animated, {
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
import { scheduleOnRN } from "react-native-worklets";

type PopupViewProps = {
    opened: SharedValue<boolean>
    dismount?: boolean
    children?: ReactNode
    style?: ViewStyle
}

const SPRING_CONFIG = {
    duration: 800,
    overshootClamping: true,
    dampingRatio: 0.8
};

export function PopupView({ opened, dismount = true, children, style }: PopupViewProps) {
    const popupDisplay = useSharedValue<"flex" | "none">("none");
    const opacity = useSharedValue(0);
    const scale = useSharedValue(1);
    const [mounted, setMounted] = useState(false);

    useAnimatedReaction(
        () => opened.value,
        (isOpened, prev) => {
            if(isOpened === prev) return;

            if(isOpened) {
                // mount and show
                popupDisplay.value = "flex";
                scheduleOnRN(setMounted, true);

                // animate in
                opacity.value = withTiming(1, { duration: 250 });
                scale.value = withSpring(1, SPRING_CONFIG);
            } else {
                // animate out
                opacity.value = withTiming(0, { duration: 250 });
                scale.value = withSpring(1.1, SPRING_CONFIG, (finished) => {
                    if(!finished) return;

                    popupDisplay.value = "none";
                    scheduleOnRN(setMounted, false);
                });
            }
        },
        []
    );

    const close = () => opened.value = false;

    const popupStyle = useAnimatedStyle(() => ({
        display: popupDisplay.value,
        opacity: opacity.value,
        transform: [{ scale: scale.value }]
    }));

    return (
        <Portal hostName="popup">
            <Overlay opened={ opened } onPress={ close }/>
            {
                (!dismount || mounted) &&
               <View style={ styles.container } pointerEvents="box-none">
                  <Animated.View style={ [popupStyle, styles.popup, style] }>
                      { children }
                  </Animated.View>
               </View>
            }
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