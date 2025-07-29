import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { ALERT_COLORS, ALERT_ICONS, COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import Icon from "../../../../components/Icon.tsx";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { AlertType, Toast } from "../../model/types/index.ts";
import { useAlert } from "../../hooks/useAlert.ts";

export type AlertToastProps = {
    toast: Toast
};
export const ALERT_SLIDE_DURATION = 450;
const AlertToast: React.FC<AlertToastProps> = ({ toast }) => {
    const {
        id,
        type,
        title,
        body,
        duration
    } = toast;
    const { closeToast } = useAlert();

    const { width } = useWindowDimensions();

    const opacity = useSharedValue(0.5);
    const x = useSharedValue(-width / 2);
    const height = useMemo(() => (!body ? hp(8) : hp(10)), [body]);
    const [removable, setRemovable] = useState(false);

    const timoutRef = useRef<NodeJS.Timeout>();

    const styles = useStyles(type, height);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ translateX: x.value }]
        };
    });

    const startAnimation = useCallback(() => {
        timoutRef.current = setTimeout(() => {
            setRemovable(true);
        }, duration + ALERT_SLIDE_DURATION);

        opacity.value = withTiming(
            1,
            { duration: ALERT_SLIDE_DURATION }
        );
        x.value = withTiming(
            0,
            { duration: ALERT_SLIDE_DURATION }
        );
    }, []);

    const endAnimation = () => {
        opacity.value = withTiming(
            0,
            { duration: ALERT_SLIDE_DURATION }
        );
        x.value = withTiming(
            width / 2,
            { duration: ALERT_SLIDE_DURATION }
        );
    };

    const dismissWithPress = () => {
        setRemovable(true);
        clearTimeout(timoutRef.current);
    };

    useEffect(() => {
        startAnimation();

        return () => clearTimeout(timoutRef.current);
    }, []);

    useEffect(() => {
        if(removable) {
            endAnimation();
            const timeout = setTimeout(() => closeToast(id), ALERT_SLIDE_DURATION);

            return () => clearTimeout(timeout);
        }
    }, [removable]);

    return (
        <Animated.View testID="ToastContainer" style={ animatedStyle }>
            <TouchableOpacity
                testID="Toast"
                style={ styles.container }
                activeOpacity={ 1 }
                onPress={ dismissWithPress }
            >
                <Icon
                    size={ height / 1.5 }
                    icon={ ALERT_ICONS[type] }
                    color={ ALERT_COLORS[type] }
                    style={ { alignSelf: "center" } }
                />
                <View style={ styles.contentContainer }>
                    <Text
                        numberOfLines={ 1 }
                        style={ styles.titleText }
                    >
                        { title }
                    </Text>
                    {
                        body &&
                       <Text
                          numberOfLines={ 2 }
                          style={ styles.text }
                       >
                           { body }
                       </Text>
                    }
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const useStyles = (type: AlertType, height: number) =>
    StyleSheet.create({
        container: {
            alignSelf: "center",
            height,
            backgroundColor: COLORS.black5,
            borderRadius: 35,
            borderColor: ALERT_COLORS[type],
            borderWidth: 1.5,
            paddingVertical: SEPARATOR_SIZES.lightSmall,
            paddingHorizontal: SEPARATOR_SIZES.small,
            flexDirection: "row",
            gap: SEPARATOR_SIZES.lightSmall
        },
        contentContainer: {
            flex: 1,
            flexDirection: "column",
            justifyContent: "center"
        },
        titleText: {
            fontFamily: "Gilroy-Heavy",
            fontSize: FONT_SIZES.p2,
            letterSpacing: FONT_SIZES.p2 * 0.05,
            color: COLORS.white
        },
        text: {
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.p4,
            letterSpacing: FONT_SIZES.p4 * 0.05,
            color: COLORS.gray1
        }
    });

export default React.memo(AlertToast);