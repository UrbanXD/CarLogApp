import {ALERT_COLORS, ALERT_ICONS, ALERT_TITLES, AlertType} from "./constants/constants";
import React from "react";
import {View, Text, StyleSheet, Modal, Easing, useWindowDimensions} from "react-native";
import {theme} from "../../../constants/theme";
import {heightPercentageToDP as hp, widthPercentageToDP} from "react-native-responsive-screen";
import {FONT_SIZES, SEPARATOR_SIZES, SIMPLE_TABBAR_HEIGHT} from "../../../constants/constants";
import Icon from "../Icon";
import { Portal } from '@gorhom/portal';
import Animated, {interpolate, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";

interface AlertToastProps {
    type?: AlertType,
    title?: string,
    body?: string,
}

const AlertToast: React.FC<AlertToastProps> = ({
    type = "info",
    title = ALERT_TITLES[type],
    body
}) => {
    const { width } = useWindowDimensions();

    const opacity = useSharedValue(0.5);
    const x = useSharedValue(-width / 2);
    const height = !body ? hp(8) : hp(9.5);

    const styles = useStyles(type, height);

    const startAnimation = () => {
        const config = {
            duration: 450
        }

        opacity.value = withTiming(
            1,
            config
        );
        x.value = withTiming(
            0,
            config
        )

    }

    React.useEffect(() => {
        startAnimation();
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ translateX: x.value }]
        };
    });

    return (
        <Portal hostName="toast">
            <Animated.View style={ [styles.container, animatedStyle] }>
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
            </Animated.View>
        </Portal>
    )
}

const useStyles = (type: AlertType, height: number) =>
    StyleSheet.create({
        container: {
            // position: "absolute",
            // bottom: SIMPLE_TABBAR_HEIGHT + SEPARATOR_SIZES.normal,
            width: "80%",
            alignSelf: "center",
            height,
            backgroundColor: theme.colors.black5,
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
            fontSize: FONT_SIZES.intermediate,
            lineHeight: FONT_SIZES.intermediate ,
            letterSpacing: FONT_SIZES.intermediate * 0.05,
            color: theme.colors.white,
        },
        text: {
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.tiny,
            letterSpacing: FONT_SIZES.tiny * 0.05,
            color: theme.colors.gray1,
        }
    })

export default AlertToast;