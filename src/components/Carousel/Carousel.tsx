import React, {ReactElement, useEffect, useRef, useState} from "react";
import {ImageSourcePropType, StyleSheet, useWindowDimensions, View} from "react-native";
import Animated, {runOnJS, runOnUI, SharedValue, useAnimatedScrollHandler, useSharedValue} from "react-native-reanimated";
import {FlatList} from "react-native-gesture-handler";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {SEPARATOR_SIZES} from "../../constants/constants";

export type CarouselItemType = {
    id: string,
    image?: ImageSourcePropType
    title: string,
    subtitle: string,
    selected?: boolean
}

export interface CarouselProps {
    data: Array<any>
    renderItem: (item: any, index: number, size: number, x: SharedValue<number>) => ReactElement
    itemSizePercentage?: number
    spacer?: number
}

const Carousel: React.FC<CarouselProps> = ({ data, renderItem, itemSizePercentage = 0.8, spacer }) => {
    const { width } = useWindowDimensions();
    const ITEM_SIZE = width * itemSizePercentage;
    const SPACER = spacer ?? (width - ITEM_SIZE) / 2;

    const x    = useSharedValue(0);

    const onScroll = useAnimatedScrollHandler({
        onScroll: event => {
            x.value = event.contentOffset.x;
        },
        onMomentumEnd: event => {
            // const value = data[Math.abs(Math.round(coordinate.value / ITEM_SIZE))];
        }
    }, []);

    const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

    return (
        <AnimatedFlatList
            data={ data }
            renderItem={
                ({ item, index }) =>
                    <React.Fragment key={ index }>
                        {
                            index === 0 &&
                                <View style={{ width: SPACER }} />
                        }
                        { renderItem(item, index, ITEM_SIZE, x) }
                        {
                            index === data.length - 1 &&
                                <View style={{ width: SPACER }} />
                        }
                    </React.Fragment>
            }
            keyExtractor={(item, index) => index.toString()}
            horizontal
            // scrollEnabled={ horizontal }
            snapToInterval={ ITEM_SIZE }
            onScroll={ onScroll }
            scrollEventThrottle={ 16 }
            showsHorizontalScrollIndicator={ false }
            showsVerticalScrollIndicator={ false }
            decelerationRate="fast"
            bounces={ false }
            bouncesZoom={ false }
            renderToHardwareTextureAndroid
            contentContainerStyle={{
                overflow: "hidden"
            }}
        />
    )
};

export default React.memo(Carousel);
