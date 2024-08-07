import React, {useLayoutEffect, useState} from "react";
import {ImageBackground, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Animated, {interpolate, SharedValue, useAnimatedStyle} from "react-native-reanimated";
import {theme} from "../../styles/theme";
import hexToRgba from "hex-to-rgba";
import {LinearGradient} from "expo-linear-gradient";
import {FONT_SIZES, SEPARATOR_SIZES} from "../../constants/constants";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

interface CarouselItemProps {
    index: number,
    size: number,
    x: SharedValue<number>
    isFocused: boolean
}
const CarouselItem: React.FC<CarouselItemProps> = ({ index, size, x, isFocused }) => {
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
        <TouchableOpacity style={{ width: size }}>
            <Animated.View style={ [styles.itemContainer, animatedStyle ] }>
                {
                    !isFocused && <View style={styles.overlay} />
                }
                <ImageBackground
                    source={ require("../../assets/car2.jpg") }
                    style={ styles.itemContentContainer }
                    imageStyle={ styles.itemImage }
                >
                    <LinearGradient
                        locations={[ 0, 0.85 ]}
                        colors={ [hexToRgba(theme.colors.primaryBackground3, 0.15), hexToRgba(theme.colors.primaryBackground3, 0.95)] }
                        style={ styles.imageOverlay }
                    />
                    {
                        isFocused &&
                            <View style={ styles.selectedContainer }>
                                <View style={ styles.selectedPoint }></View>
                            </View>
                    }
                    <View style={{ paddingHorizontal: SEPARATOR_SIZES.normal,
                        paddingVertical: hp(0.5), }}>
                        <Text style={{ color: "white", textShadowColor: 'rgba(0, 0, 0, 0.75)',
                            textShadowOffset: {width: -1, height: 1},
                            textShadowRadius: 15, fontSize: FONT_SIZES.normal, fontFamily: "Gilroy-Heavy" }}>SA-HK025</Text>
                    </View>
                    <View style={ styles.infoContainer }>
                        <Text style={{ color: "white", textShadowColor: 'rgba(0, 0, 0, 0.75)',
                            textShadowOffset: {width: -1, height: 1},
                            textShadowRadius: 15,fontSize: FONT_SIZES.normal, fontFamily: "Gilroy-Heavy" }}>
                            Mercedes-Benz
                        </Text>
                        <Text style={{ color: "white", fontSize: FONT_SIZES.small, fontFamily: "Gilroy-Medium" }}>
                            C osztály
                        </Text>
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
        backgroundColor: theme.colors.primaryBackground3,
        borderRadius: 35,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: hexToRgba(theme.colors.white, 1),
        borderRadius: 35
    },
    itemContentContainer: {
        flex: 1
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
    selectedContainer: {
        position: "absolute",
        right: 0,
        width: hp(5), height: hp(5),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.white,
        borderTopRightRadius: 35,
        borderBottomLeftRadius: 15,
        borderColor: theme.colors.primaryBackground3,
        borderBottomWidth: 3,
        borderLeftWidth: 3,
    },
    selectedPoint: {
        borderRadius: 100,
        alignSelf: "center",
        backgroundColor: theme.colors.primaryBackground3,
        width: hp(1.25),
        height: hp(1.25)
    },
    infoContainer: {
        position: "absolute",
        bottom: 0,
        paddingHorizontal: SEPARATOR_SIZES.normal,
        paddingVertical: SEPARATOR_SIZES.small,
    }
})

export default CarouselItem