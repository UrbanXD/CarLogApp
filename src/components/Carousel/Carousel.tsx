import React, { ReactElement, useEffect, useRef } from "react";
import { ImageSourcePropType, useWindowDimensions, View } from "react-native";
import Animated, { SharedValue, useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { FlatList } from "react-native-gesture-handler";

export interface CarouselItemType {
    id: string,
    image?: ImageSourcePropType | string
    title?: string,
    subtitle?: string,
    body?: string,
    selected?: boolean
}

export interface CarouselProps {
    data: Array<any>;
    renderItem: (item: any, index: number, size: number, x: SharedValue<number>) => ReactElement;
    renderDefaultItem?: (size: number, spacerWidth: number) => ReactElement;
    contentWidth?: number;
    itemSizePercentage?: number;
    spacer?: number;
}

const Carousel: React.FC<CarouselProps> = ({
    data,
    renderItem,
    renderDefaultItem,
    contentWidth,
    itemSizePercentage = 0.8,
    spacer
}) => {
    const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
    const flatlistRef = useRef<FlatList>(null);

    const width = contentWidth ?? useWindowDimensions().width;
    const ITEM_SIZE = width * itemSizePercentage;
    const SPACER = spacer ?? (width - ITEM_SIZE) / 2;

    const x = useSharedValue(0);
    const onScroll = useAnimatedScrollHandler({
        onScroll: event => {
            x.value = event.contentOffset.x;
        }
    }, []);

    useEffect(() => {
        flatlistRef.current?.scrollToOffset({ animated: false, offset: x.value });
    }, [data]);

    return (
        <AnimatedFlatList
            ref={ flatlistRef }
            data={ data }
            renderItem={
                ({ item, index }) =>
                    <React.Fragment key={ index }>
                        {
                            index === 0 &&
                            <View style={ { width: SPACER } }/>
                        }
                        { renderItem(item, index, ITEM_SIZE, x) }
                        {
                            index === data.length - 1 &&
                            <View style={ { width: SPACER } }/>
                        }
                    </React.Fragment>
            }
            ListEmptyComponent={ renderDefaultItem ? renderDefaultItem(ITEM_SIZE, SPACER) : <></> }
            keyExtractor={ (_, index) => index.toString() }
            horizontal
            snapToInterval={ ITEM_SIZE }
            onScroll={ onScroll }
            scrollEventThrottle={ 16 }
            showsHorizontalScrollIndicator={ false }
            showsVerticalScrollIndicator={ false }
            decelerationRate="fast"
            bounces={ false }
            bouncesZoom={ false }
            renderToHardwareTextureAndroid
            contentContainerStyle={ {
                overflow: "hidden",
                flexGrow: 1
            } }
        />
    );
};

export default Carousel;
