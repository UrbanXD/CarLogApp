import React, {ReactNode, useState} from "react";
import {ImageSourcePropType, ScrollView, StyleSheet, Text, useWindowDimensions, View} from "react-native";
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
import CarouselItem from "./CarouselItem";

export type CarouselItemType = {
    id: string,
    image?: ImageSourcePropType
    title: string,
    subtitle: string,
    selected?: boolean
}

interface CarouselProps {
    data: Array<CarouselItemType>
}

const Carousel: React.FC<CarouselProps> = ({ data }) => {
    const {width} = useWindowDimensions();
    const ITEM_SIZE = width * 0.8;
    const SPACER = (width - ITEM_SIZE) / 2;

    const x = useSharedValue(0);
    const [focusedIndex, setFoucesdIndex] = useState(Math.round(x.value / ITEM_SIZE));

    const onScroll = useAnimatedScrollHandler({
        onScroll: event => {
            x.value = event.contentOffset.x;
            const currentIndex = Math.round(x.value / ITEM_SIZE)
            if(focusedIndex != currentIndex) {
                runOnJS(setFoucesdIndex)(currentIndex)
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
            contentContainerStyle={ styles.scrollViewContainer }
        >
            {
                data.map((item, index) => {
                    if(item.image === undefined){
                        item.image = require("../../assets/car1.jpg");
                    }

                    return (
                        <React.Fragment key={index}>
                            {index === 0 && <View style={{width: SPACER}}/>}
                            <CarouselItem
                                index={index}
                                size={ITEM_SIZE}
                                x={x}
                                isFocused={focusedIndex === index}
                                item={item}
                            />
                            {index === data.length - 1 && <View style={{width: SPACER}}/>}
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
    }
});

export default Carousel;