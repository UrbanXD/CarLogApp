import React, { ReactElement, useCallback, useEffect, useRef } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { SharedValue, useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { AnimatedFlashList } from "../AnimatedComponents";
import { FlashListRef, ListRenderItemInfo } from "@shopify/flash-list";
import { ViewStyle } from "../../types";

export interface CarouselItemType {
    id: string,
    image?: {
        uri: string
        attachment?: boolean
    } | null,
    title?: string,
    subtitle?: string,
    body?: string,
    selected?: boolean
}

export type CarouselProps<Item> = {
    data: Array<Item>
    loading?: boolean
    renderItem: (item: Item, index: number, size: number, x: SharedValue<number>) => ReactElement
    renderDefaultItem?: (size: number, spacerWidth: number, loading: boolean) => ReactElement
    keyExtractor?: (item: Item, index: number) => string
    contentWidth?: number
    itemSizePercentage?: number
    spacer?: number
    containerStyle?: ViewStyle
    contentContainerStyle?: ViewStyle
}

export function Carousel<Item>({
    data,
    loading,
    renderItem,
    renderDefaultItem,
    keyExtractor,
    contentWidth,
    itemSizePercentage = 0.8,
    spacer,
    containerStyle,
    contentContainerStyle
}: CarouselProps<Item>) {
    const flashListRef = useRef<InstanceType<typeof AnimatedFlashList<Item>> & FlashListRef<Item>>(null);

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
        const maxOffset = Math.max(0, (data.length - 1) * ITEM_SIZE);
        if(x.value > maxOffset) x.value = maxOffset;

        flashListRef.current?.scrollToOffset({ animated: false, offset: x.value });
    }, [data]);

    const renderCarouselItem = useCallback(({ item, index }: ListRenderItemInfo<Item>) => (
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
    ), [SPACER, renderItem]);

    const carouselKeyExtractor = useCallback((item: Item, index: number) => {
        if(keyExtractor) return keyExtractor(item, index);

        return (item as any)?.id?.toString() ?? index.toString();
    }, [keyExtractor]);

    return (
        <View style={ [styles.container, containerStyle] }>
            <AnimatedFlashList<Item>
                ref={ flashListRef }
                data={ data }
                renderItem={ renderCarouselItem }
                ListEmptyComponent={ renderDefaultItem ? renderDefaultItem(ITEM_SIZE, SPACER, !!loading) : <></> }
                keyExtractor={ carouselKeyExtractor }
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
                contentContainerStyle={ [styles.contentContainerStyle, contentContainerStyle] }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative"
    },
    contentContainerStyle: {
        flexGrow: 1,
        overflow: "hidden"
    }
});