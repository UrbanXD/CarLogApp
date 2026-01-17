import React from "react";
import { SharedValue, useAnimatedProps } from "react-native-reanimated";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../constants/index.ts";
import { AnimatedCircle } from "./AnimatedComponents/index.ts";

type ProgressInfoProps = {
    radius: number
    strokeWidth: number
    end: SharedValue<number>
    statusText: string
    stepTitle: string
    stepSubtitle?: string
}

export function ProgressInfo({
    radius,
    strokeWidth,
    end,
    statusText,
    stepTitle,
    stepSubtitle
}: ProgressInfoProps) {
    const center = radius;
    const innerRadius = radius - strokeWidth / 2;
    const circumference = 2 * Math.PI * innerRadius;

    const animatedProps = useAnimatedProps(() => (
        { strokeDashoffset: circumference * (1 - end.value) }
    ));

    const styles = useStyles(radius);

    return (
        <View style={ styles.container }>
            <View style={ styles.circularProgressBarContainer }>
                <Svg width={ radius * 2 } height={ radius * 2 }>
                    <Circle
                        cx={ center }
                        cy={ center }
                        r={ innerRadius }
                        stroke={ COLORS.gray4 }
                        strokeWidth={ strokeWidth }
                        fill="transparent"
                        strokeLinecap="round"
                    />

                    <AnimatedCircle
                        cx={ center }
                        cy={ center }
                        r={ innerRadius }
                        stroke={ COLORS.greenLight }
                        strokeWidth={ strokeWidth }
                        fill="transparent"
                        strokeLinecap="round"
                        transform={ `rotate(-90, ${ center }, ${ center })` }
                        strokeDasharray={ circumference }
                        animatedProps={ animatedProps }
                    />
                </Svg>
                <View style={ styles.statusTextContainer }>
                    <Text style={ styles.statusText } numberOfLines={ 1 } adjustsFontSizeToFit>
                        { statusText }
                    </Text>
                </View>
            </View>
            <View style={ styles.titleContainer }>
                <Text style={ styles.title }>{ stepTitle }</Text>
                {
                    stepSubtitle &&
                   <Text style={ styles.subtitle }>{ stepSubtitle }</Text>
                }
            </View>
        </View>
    );
}

const useStyles = (radius: number) =>
    StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            gap: SEPARATOR_SIZES.lightSmall
        },
        circularProgressBarContainer: {
            width: radius * 2,
            height: radius * 2
        },
        statusTextContainer: {
            ...StyleSheet.absoluteFillObject,
            justifyContent: "center",
            alignItems: "center"
        },
        statusText: {
            fontSize: FONT_SIZES.h3,
            fontFamily: "Gilroy-Heavy",
            color: "white"
        },
        titleContainer: {
            flex: 1,
            justifyContent: "center",
            alignSelf: "center"
        },
        title: {
            fontSize: FONT_SIZES.h3,
            fontFamily: "Gilroy-Heavy",
            color: COLORS.white
        },
        subtitle: {
            fontSize: FONT_SIZES.p2,
            fontFamily: "Gilroy-Medium",
            color: COLORS.gray1
        }
    });