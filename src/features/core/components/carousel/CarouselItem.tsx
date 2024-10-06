import React from "react";
import {
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { theme } from "../../constants/theme";
import hexToRgba from "hex-to-rgba";
import { LinearGradient } from "expo-linear-gradient";
import {
    FONT_SIZES,
    GET_ICON_BUTTON_RESET_STYLE,
    ICON_NAMES,
    SEPARATOR_SIZES
} from "../../constants/constants";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { CarouselItemType } from "./Carousel";
import { IconButton } from "react-native-paper";

interface CarouselItemProps {
    index: number
    size: number
    x: SharedValue<number>
    isFocused: boolean
    item: CarouselItemType
    onPress: (index: number) => void
}
const CarouselItem: React.FC<CarouselItemProps> = ({
    index,
    size,
    x,
    isFocused,
    item,
    onPress
}) => {
    const animatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            x.value,
            [size * (index - 1), size * index , size * (index + 1)],
            [0.9, 1, 0.9],
        );

        return {
            transform: [{scale}]
        };
    });

    return (
        <TouchableOpacity
            activeOpacity={ 1 }
            style={{ width: size }}
            onPress={ () => onPress(index) }
            disabled={ item.selected }
        >
            <Animated.View style={ [styles.itemContainer, animatedStyle ] }>
                {
                    !isFocused && <View style={styles.overlay} />
                }
                <ImageBackground
                    source={ item.image || require("../../../../assets/images/car1.jpg") }
                    style={ styles.itemContentContainer }
                    imageStyle={ styles.itemImage }
                >
                    <LinearGradient
                        locations={[ 0, 0.85 ]}
                        colors={ [hexToRgba(theme.colors.black, 0.15), hexToRgba(theme.colors.black, 0.95)] }
                        style={ styles.imageOverlay }
                    />
                    <View style={ styles.topContainer }>
                        <Text style={ styles.topContainerTitleText }>
                            { item.id }
                        </Text>
                        <View style={ [styles.topContainerSelectedContainer, { width: styles.selectedContent.width, height: styles.selectedContent.height}] }>
                            {
                                item.selected &&
                                <View style={ styles.selectedContent }>
                                    <View style={ styles.selectedPoint } />
                                </View>
                            }
                        </View>
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
                        <View style={ styles.rightContainer }>
                            <IconButton
                                onPress={() => console.log("hllo")}
                                size={ FONT_SIZES.medium }
                                icon={ ICON_NAMES.pencil }
                                iconColor={ theme.colors.white }
                                style={ GET_ICON_BUTTON_RESET_STYLE(FONT_SIZES.medium * 1.25) }
                            />
                        </View>
                    </View>
                </ImageBackground>
            </Animated.View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        position: "relative",
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
        borderWidth: 0.5,
        borderRadius: 35,
        borderColor: theme.colors.gray3
    },
    itemImage: {
        width: "100%",
        resizeMode: "cover",
        borderRadius: 35,
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 35,
    },
    topContainer: {
        flexDirection: "row",
        paddingLeft: SEPARATOR_SIZES.normal,
        paddingVertical: hp(0.45)
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
    topContainerSelectedContainer: {
        paddingLeft: SEPARATOR_SIZES.lightLarge,
        marginTop: -hp(0.5)
    },
    selectedContent: {
        position: "absolute",
        right: 0,
        width: hp(5), height: hp(5),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.white,
        borderTopRightRadius: 35,
        borderBottomLeftRadius: 15,
        borderColor: theme.colors.black,
        borderBottomWidth: 3,
        borderLeftWidth: 3,
    },
    selectedPoint: {
        borderRadius: 100,
        alignSelf: "center",
        backgroundColor: theme.colors.black,
        width: hp(1.25),
        height: hp(1.25)
    },
    bottomContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        flexDirection: "row",
        paddingHorizontal: SEPARATOR_SIZES.normal,
        paddingVertical: SEPARATOR_SIZES.small,
    },
    infoContainer: {
        width: "80%",
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
        fontSize: FONT_SIZES.extraSmall,
        fontFamily: "Gilroy-Medium",
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 10,
        letterSpacing: FONT_SIZES.extraSmall * 0.05
    },
    rightContainer: {
        width: "20%",
        justifyContent: "flex-end",
        alignItems: "flex-end"
    }
})

export default CarouselItem;