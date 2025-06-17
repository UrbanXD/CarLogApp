import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../constants/index.ts";
import Icon from "../../../components/Icon";
import Animated, { useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import { AlertType } from "../constants/types.ts";
import { ALERT_TITLES, ALERT_COLORS, ALERT_ICONS } from "../../../constants";

export interface AlertToastProps {
    type?: AlertType,
    title?: string,
    body?: string,
    duration?: number,
    close?: () => void
}

const AlertToast: React.FC<AlertToastProps> = ({
    type = "info",
    title = ALERT_TITLES[type],
    body,
    duration = 4000,
    close
}) => {
    const { width } = useWindowDimensions();

    const opacity = useSharedValue(0.5);
    const x = useSharedValue(-width / 2);
    const height = !body ? hp(8) : hp(10);
    const [removable, setRemovable] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout>();

    const styles = useStyles(type, height);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ translateX: x.value }]
        };
    });

    const config = {
        duration: 450
    };

    const interval = () => {
        intervalRef.current = setInterval(() => {
            setRemovable(true);
        }, duration + config.duration);
    }

    const startAnimation = useCallback(() => {
        interval();

        opacity.value = withTiming(
            1,
            config
        );
        x.value = withTiming(
            0,
            config
        );
    }, [])

    const endAnimation = () => {
        opacity.value = withTiming(
            0,
            config
        );
        x.value = withTiming(
            width / 2,
            config
        )
    }

    const dismissWithPress = () => {
        setRemovable(true);
        clearInterval(intervalRef.current);
    }

    useEffect(() => {
        startAnimation();

        return () => clearInterval(intervalRef.current);
    }, []);

    useEffect(() => {
        if (removable) {
            endAnimation();
            const timeout = setTimeout(() => {
                if(close){
                    close();
                }
            }, config.duration);

            return () => clearTimeout(timeout);
        }
    }, [removable]);

    return (
        <Animated.View style={ animatedStyle }>
            <TouchableOpacity
                style={ styles.container }
                activeOpacity={ 1 }
                onPress={ dismissWithPress }
            >
                <Icon
                    size={ height / 1.5 }
                    icon={ ALERT_ICONS[type] }
                    color={ ALERT_COLORS[type] }
                    style={{ alignSelf: "center" }}
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
    )
}

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
            gap: SEPARATOR_SIZES.lightSmall,
        },
        contentContainer: {
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
        },
        titleText: {
            fontFamily: "Gilroy-Heavy",
            fontSize: FONT_SIZES.p2,
            letterSpacing: FONT_SIZES.p2 * 0.05,
            color: COLORS.white,
        },
        text: {
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.p4,
            letterSpacing: FONT_SIZES.p4 * 0.05,
            color: COLORS.gray1,
        }
    })

export default React.memo(AlertToast);