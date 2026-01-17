import React, { ReactElement } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { COLORS, FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../../constants";
import { CarouselItemType } from "./Carousel";
import Image from "../Image";
import { AnimatedPressable } from "../AnimatedComponents";
import { ViewStyle } from "../../types";

type CarouselItemProps = {
    index: number
    size: number
    x: SharedValue<number>
    overlay?: boolean
    item: CarouselItemType
    cardAction?: () => void
    renderBottomActionButton?: () => ReactElement
    renderTopActionButton?: () => ReactElement
    containerStyle?: ViewStyle
}

function CarouselItem({
    index,
    size,
    x,
    overlay = false,
    item,
    cardAction,
    renderBottomActionButton,
    renderTopActionButton,
    containerStyle
}: CarouselItemProps) {
    const animatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            x.value,
            [size * (index - 1), size * index, size * (index + 1)],
            [0.9, 1, 0.9]
        );

        return {
            transform: [{ scale }]
        };
    });

    return (
        <AnimatedPressable
            key={ item.id }
            style={ [{ width: size }, containerStyle] }
            onPress={ cardAction }
            disabled={ !cardAction }
        >
            <Animated.View style={ [styles.itemContainer, animatedStyle, containerStyle] }>
                <Image
                    path={ item?.image?.uri }
                    attachment={ item?.image?.attachment ?? false }
                    alt={ ICON_NAMES.car }
                    imageStyle={ containerStyle }
                >
                    <View style={ styles.topContainer }>
                        <Text style={ styles.topContainerTitleText }>
                            { item.title }
                        </Text>
                        {
                            renderTopActionButton &&
                           <View style={ styles.actionContainer }>
                               { renderTopActionButton() }
                           </View>
                        }
                    </View>
                    <View style={ styles.bottomContainer }>
                        <View style={ styles.infoContainer }>
                            <Text numberOfLines={ 2 } style={ styles.infoTitleText }>
                                { item.subtitle }
                            </Text>
                            <Text numberOfLines={ 2 } style={ styles.infoSubtitleText }>
                                { item.body }
                            </Text>
                        </View>
                        {
                            renderBottomActionButton &&
                           <View style={ styles.actionContainer }>
                               { renderBottomActionButton() }
                           </View>
                        }
                    </View>
                </Image>
            </Animated.View>
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        backgroundColor: COLORS.black,
        borderRadius: 35
    },
    topContainer: {
        flexDirection: "row",
        padding: SEPARATOR_SIZES.mediumSmall,
        paddingLeft: SEPARATOR_SIZES.normal
    },
    bottomContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        flexDirection: "row",
        padding: SEPARATOR_SIZES.mediumSmall,
        paddingLeft: SEPARATOR_SIZES.normal
    },
    topContainerTitleText: {
        flex: 1,
        color: COLORS.white,
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p1,
        textShadowColor: "rgba(0, 0, 0, 0.75)",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
        letterSpacing: FONT_SIZES.p1 * 0.05
    },
    infoContainer: {
        flex: 1
    },
    infoTitleText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.p2,
        fontFamily: "Gilroy-Heavy",
        textShadowColor: "rgba(0, 0, 0, 0.75)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 10,
        letterSpacing: FONT_SIZES.p2 * 0.05
    },
    infoSubtitleText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.p4,
        fontFamily: "Gilroy-Medium",
        textShadowColor: "rgba(0, 0, 0, 0.75)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 10,
        letterSpacing: FONT_SIZES.p4 * 0.05
    },
    actionContainer: {
        width: "20%",
        justifyContent: "flex-end",
        alignItems: "flex-end"
    }
});

export default CarouselItem;