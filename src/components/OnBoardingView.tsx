import React, { useCallback, useEffect, useRef } from "react";
import { ListRenderItemInfo, useWindowDimensions } from "react-native";
import { DEFAULT_SEPARATOR } from "../constants/index.ts";
import { RenderComponent } from "../types/index.ts";
import { useBottomSheetInternal, useBottomSheetScrollableCreator } from "@gorhom/bottom-sheet";
import { FlatList } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";

type OnBoardingViewProps = {
    steps: Array<RenderComponent>
    currentStep?: number
}

function OnBoardingView({ steps, currentStep = 0 }: OnBoardingViewProps) {
    const isBottomSheet = !!useBottomSheetInternal(true);
    const BottomSheetFlashListScrollable = isBottomSheet ? useBottomSheetScrollableCreator() : undefined;

    const flatListRef = useRef<FlatList>(null);

    const width = useWindowDimensions().width - 2 * DEFAULT_SEPARATOR;

    useEffect(() => {
        flatListRef.current?.scrollToOffset({ offset: currentStep * width, animated: true });
    }, [currentStep, width]);

    const keyExtractor = useCallback((_, index: number) => index.toString(), []);

    const renderStep = useCallback(({ item }: ListRenderItemInfo<RenderComponent>) => item(), []);

    const renderItem = useCallback(({ item }: ListRenderItemInfo<RenderComponent>) => (
        <FlashList
            data={ [item] }
            renderItem={ renderStep }
            keyExtractor={ keyExtractor }
            contentContainerStyle={ { width } }
            nestedScrollEnabled
            showsVerticalScrollIndicator={ false }
            renderScrollComponent={ BottomSheetFlashListScrollable }
        />
    ), [width, renderStep]);

    return (
        <FlatList
            ref={ flatListRef }
            data={ steps }
            renderItem={ renderItem }
            keyExtractor={ keyExtractor }
            horizontal
            scrollEnabled={ false }
            nestedScrollEnabled
            showsHorizontalScrollIndicator={ false }
        />
    );
};

export default OnBoardingView;