import React, {ReactElement, useCallback, useEffect, useState} from "react";
import {
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { theme } from "../../Shared/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import {
    FONT_SIZES, ICON_NAMES,
    SEPARATOR_SIZES
} from "../../Shared/constants/constants";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { CarouselItemType } from "./Carousel";
import { hexToRgba } from "../../Shared/utils/colors/hexToRgba";
import {formatImageSource} from "../../Shared/utils/formatImageSource";
import DefaultElement from "../../Shared/components/DefaultElement";

interface CarouselItemProps {
    index: number
    size: number
    x: SharedValue<number>
    overlay?: boolean
    item: CarouselItemType
    cardAction?: () => void
    renderBottomActionButton?: () => ReactElement
    renderTopActionButton?: () => ReactElement
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
    const [imageError, setImageError] = useState<boolean>(!item.image);

    const animatedStyle = useAnimatedStyle(() => {
        const scaleY = interpolate(
            x.value,
            [size * (index - 1), size * index , size * (index + 1)],
            [0.85, 1, 0.85],
        );

        return {
            transform: [{ scaleY }]
        };
    });

    const handleImageLoadError = useCallback(
        () => {
            console.log("imageLoadError");
            setImageError(true)
        },
        [item]
    );

    useEffect(() => {
        console.log(imageError)
    }, [imageError]);

    return (
        <TouchableOpacity
            activeOpacity={ 1 }
            style={{ width: size, paddingHorizontal: 10 }}
            onPress={ cardAction }
            disabled={ !cardAction }
        >
            <Animated.View style={ [styles.itemContainer, animatedStyle ] }>
                {
                    overlay && <View style={ styles.overlay } />
                }
                {
                    !imageError
                        ?   <Image
                                source={ formatImageSource(item?.image || "") }
                                onError={ handleImageLoadError }
                                style={ styles.itemImage }
                            />
                        :   <View style={ styles.itemImage }>
                                <DefaultElement
                                    icon={ ICON_NAMES.car }
                                />
                            </View>
                }
                <View
                    style={ styles.itemContentContainer }
                >
                    {
                        overlay && !imageError &&
                        <LinearGradient
                            locations={[ 0, 0.85 ]}
                            colors={ [hexToRgba(theme.colors.black, 0.15), hexToRgba(theme.colors.black, 0.95)] }
                            style={ styles.imageOverlay }
                        />
                    }
                    <View style={ styles.topContainer }>
                        <Text style={ styles.topContainerTitleText }>
                            { item.id }
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
                                { item.title }
                            </Text>
                            <Text numberOfLines={ 2 } style={ styles.infoSubtitleText }>
                                { item.subtitle }
                            </Text>
                        </View>
                        {
                            renderBottomActionButton &&
                            <View style={ styles.actionContainer }>
                                { renderBottomActionButton() }
                            </View>
                        }
                    </View>
                </View>
            </Animated.View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        backgroundColor: theme.colors.black,
        borderRadius: 35,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: hexToRgba(theme.colors.white, 0.035),
        borderRadius: 35,
        zIndex: 1
    },
    itemContentContainer: {
        flex: 1,
        borderWidth: 1.5,
        borderRadius: 35,
        borderColor: theme.colors.gray4
    },
    itemImage: {
        position: "absolute",
        width: "100%",
        height: "100%",
        resizeMode: "cover",
        borderRadius: 35,
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 33,
    },
    topContainer: {
        flexDirection: "row",
        padding: SEPARATOR_SIZES.lightSmall,
        paddingLeft: SEPARATOR_SIZES.normal,
    },
    bottomContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        flexDirection: "row",
        padding: SEPARATOR_SIZES.lightSmall,
        paddingLeft: SEPARATOR_SIZES.normal,
    },
    topContainerTitleText: {
        flex: 1,
        paddingVertical: hp(1),
        color: theme.colors.white,
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.normal,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
        letterSpacing: FONT_SIZES.normal * 0.05,
        lineHeight: FONT_SIZES.normal * 0.85,
    },
    infoContainer: {
        flex: 1,
    },
    infoTitleText: {
        color: theme.colors.white,
        fontSize: FONT_SIZES.small,
        fontFamily: "Gilroy-Heavy",
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 10,
        letterSpacing: FONT_SIZES.small * 0.05
    },
    infoSubtitleText: {
        color: theme.colors.white,
        fontSize: FONT_SIZES.tiny,
        fontFamily: "Gilroy-Medium",
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 10,
        letterSpacing: FONT_SIZES.tiny * 0.05
    },
    actionContainer: {
        width: "20%",
        justifyContent: "flex-end",
        alignItems: "flex-end"
    }
})

export default CarouselItem;