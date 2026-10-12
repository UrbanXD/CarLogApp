import React, { ReactElement, useCallback, useEffect, useRef } from "react";
import {
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    useWindowDimensions,
    View
} from "react-native";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import { ViewStyle } from "../../types";
import { WEB_SCROLLBAR_STYLE } from "../screenView/webScrollbarStyle";

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
    const { width: viewportWidth } = useWindowDimensions();
    const showScrollbar = viewportWidth >= 1040;
    const width = contentWidth ?? viewportWidth;
    const itemSize = width * itemSizePercentage;
    const spacerWidth = spacer ?? (width - itemSize) / 2;
    const scrollRef = useRef<ScrollView>(null);
    const lastScrollOffset = useRef(0);
    const x = useSharedValue(0);

    useEffect(() => {
        const maxOffset = Math.max(0, (data.length - 1) * itemSize);
        const nextOffset = Math.min(x.value, maxOffset);
        x.value = nextOffset;
        lastScrollOffset.current = nextOffset;
        scrollRef.current?.scrollTo({ x: nextOffset, animated: false });
    }, [data, itemSize, x]);

    const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offset = event.nativeEvent.contentOffset.x;
        lastScrollOffset.current = offset;
        x.value = offset;
    }, [x]);

    const onWheel = useCallback((event: WheelEvent) => {
        if(Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

        event.preventDefault();
        const nextOffset = Math.max(0, lastScrollOffset.current + event.deltaY);
        lastScrollOffset.current = nextOffset;
        scrollRef.current?.scrollTo({ x: nextOffset, animated: false });
        x.value = nextOffset;
    }, [x]);

    const webScrollProps = { onWheel } as any;

    return (
        <View style={ [styles.container, containerStyle] }>
            <ScrollView
                ref={ scrollRef }
                style={ showScrollbar ? WEB_SCROLLBAR_STYLE : undefined }
                { ...webScrollProps }
                horizontal
                onScroll={ onScroll }
                scrollEventThrottle={ 16 }
                snapToInterval={ itemSize }
                decelerationRate="fast"
                showsHorizontalScrollIndicator={ showScrollbar }
                showsVerticalScrollIndicator={ false }
                contentContainerStyle={ [styles.contentContainer, contentContainerStyle] }
            >
                {
                    data.length === 0
                    ? renderDefaultItem?.(itemSize, spacerWidth, !!loading)
                    : data.map((item, index) => (
                        <React.Fragment key={ keyExtractor?.(item, index) ?? (item as any)?.id ?? index }>
                            { index === 0 && <View style={ { width: spacerWidth } }/> }
                            { renderItem(item, index, itemSize, x) }
                            { index === data.length - 1 && <View style={ { width: spacerWidth } }/> }
                        </React.Fragment>
                    ))
                }
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minWidth: 0,
        position: "relative"
    },
    contentContainer: {
        flexGrow: 1,
        alignItems: "stretch"
    }
});
