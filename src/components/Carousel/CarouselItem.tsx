import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { COLORS, FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../../constants/index.ts";
import { CarouselItemType } from "./Carousel";
import { hexToRgba } from "../../utils/colors/hexToRgba";
import Image from "../Image";

interface CarouselItemProps {
    index: number;
    size: number;
    x: SharedValue<number>;
    overlay?: boolean;
    item: CarouselItemType;
    cardAction?: () => void;
    renderBottomActionButton?: () => React.ReactElement;
    renderTopActionButton?: () => React.ReactElement;
}

const CarouselItem: React.FC<CarouselItemProps> = ({
    index,
    size,
    x,
    overlay = false,
    item,
    cardAction,
    renderBottomActionButton,
    renderTopActionButton
}) => {
    const animatedStyle = useAnimatedStyle(() => {
        const scaleY = interpolate(
            x.value,
            [size * (index - 1), size * index, size * (index + 1)],
            [0.85, 1, 0.85]
        );

        return {
            transform: [{ scaleY }]
        };
    });

    return (
        <TouchableOpacity
            key={ item.id }
            activeOpacity={ 1 }
            style={ { width: size, paddingHorizontal: 10 } }
            onPress={ cardAction }
            disabled={ !cardAction }
        >
            <Animated.View style={ [styles.itemContainer, animatedStyle] }>
                <Image
                    source={ item.image || "" }
                    alt={ ICON_NAMES.car }
                    // imageStyle={}
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
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        backgroundColor: COLORS.black,
        borderRadius: 35
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: hexToRgba(COLORS.white, 0.035),
        borderRadius: 35,
        zIndex: 1
    },
    itemContentContainer: {
        flex: 1,
        borderWidth: 1.5,
        borderRadius: 35,
        borderColor: COLORS.gray4
    },
    itemImage: {
        position: "absolute",
        width: "100%",
        height: "100%",
        resizeMode: "cover",
        borderRadius: 35
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 33
    },
    topContainer: {
        flexDirection: "row",
        padding: SEPARATOR_SIZES.lightSmall,
        paddingLeft: SEPARATOR_SIZES.normal
    },
    bottomContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        flexDirection: "row",
        padding: SEPARATOR_SIZES.lightSmall,
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