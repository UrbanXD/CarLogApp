import React, {ReactNode, useState} from "react";
import {ScrollView, StyleSheet, Text, useWindowDimensions, View} from "react-native";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {SEPARATOR_SIZES} from "../../constants/constants";
import Animated, {
    interpolate, runOnJS,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue
} from "react-native-reanimated";
import hexToRgba from "hex-to-rgba";
import {theme} from "../../styles/theme";

interface CarouselProps {
    data: Array<ReactNode>
}

const Carousel: React.FC<CarouselProps> = ({ data }) => {
    const {width} = useWindowDimensions();
    const ITEM_SIZE = width * 0.75;
    const SPACER = (width - ITEM_SIZE) / 2;

    // const ITEM_SIZE = wp(75);
    // const SPACER = (wp(100) - ITEM_SIZE) / 2;

    const x = useSharedValue(0);
    const [focusedIndex, setFoucesdIndex] = useState(Math.round(x.value / ITEM_SIZE));

    const onScroll = useAnimatedScrollHandler({
        onScroll: event => {
            x.value = event.contentOffset.x;
            if(focusedIndex != Math.round(x.value / ITEM_SIZE)) {
                runOnJS(setFoucesdIndex)(Math.round(x.value / ITEM_SIZE))
            }
        }
    });

    return (
        <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={ false }
            bounces={ false }
            scrollEventThrottle={ 16 }
            snapToInterval={ ITEM_SIZE }
            decelerationRate="fast"
            onScroll={ onScroll }
            contentContainerStyle={ styles.scrollViewContainer }>
            {
                data.map((renderItem, index) => {
                    const style = useAnimatedStyle(() => {
                        const scale = interpolate(
                            x.value,
                            [ITEM_SIZE * (index - 1), ITEM_SIZE * index , ITEM_SIZE * (index + 1)],
                            [0.9, 1, 0.9],
                        );

                        return {
                            transform: [{scale}]
                        };
                    });
                    return (
                        <React.Fragment key={index}>
                            { index === 0 && <View style={{ width: SPACER }} /> }
                            <View style={{ width: ITEM_SIZE }}>
                                <Animated.View style={[{ backgroundColor: theme.colors.primaryBackground3, flex: 1, padding:35, borderRadius: 34,
                                    overflow: 'hidden', position: 'relative' }, style ]}>
                                    <Text style={{ color: "white" }}> { index } </Text>
                                    {focusedIndex !== index && (
                                        <View style={styles.overlay} />
                                    )}
                                </Animated.View>
                            </View>
                            { index === data.length - 1 && <View style={{ width: SPACER }} /> }
                        </React.Fragment>
                    )
                })
            }
        </Animated.ScrollView>
    )
};

const styles = StyleSheet.create({
    scrollViewContainer: {
        // gap: SEPARATOR_SIZES.medium,
        justifyContent: "center",
        // backgroundColor: "yellow"
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: hexToRgba(theme.colors.white, 0.025),
        borderRadius: 34
    }
});

export default Carousel;