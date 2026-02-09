import React, { useCallback, useEffect, useRef, useState } from "react";
import { ListRenderItemInfo, useWindowDimensions, View } from "react-native";
import { DEFAULT_SEPARATOR } from "../constants";
import { RenderComponent } from "../types";
import { useBottomSheetInternal, useBottomSheetScrollableCreator } from "@gorhom/bottom-sheet";
import { FlatList } from "react-native-gesture-handler";
import { FlashList, ListRenderItemInfo as FlashListRenderItemInfo } from "@shopify/flash-list";

type OnBoardingViewProps = {
    steps: Array<RenderComponent>
    currentStep?: number
}

export function OnBoardingView({
    steps,
    currentStep = 0
}: OnBoardingViewProps) {
    const isBottomSheet = !!useBottomSheetInternal(true);
    const BottomSheetFlashListScrollable = isBottomSheet
                                           ? useBottomSheetScrollableCreator()
                                           : undefined;

    const flatListRef = useRef<FlatList>(null);

    const { width: windowWidth } = useWindowDimensions();
    const width = windowWidth - 2 * DEFAULT_SEPARATOR;

    const [stepHeights, setStepHeights] = useState<Record<number, number>>({});
    const [visitedSteps, setVisitedSteps] = useState<Set<number>>(
        () => new Set([currentStep])
    );

    useEffect(() => {
        setVisitedSteps(prev => {
            if(prev.has(currentStep)) return prev;

            const next = new Set(prev);
            next.add(currentStep);
            return next;
        });
    }, [currentStep]);

    useEffect(() => {
        flatListRef.current?.scrollToOffset({
            offset: currentStep * width,
            animated: true
        });
    }, [currentStep, width]);

    const currentHeight = stepHeights[currentStep];

    const containerStyle = {
        height: currentHeight ?? undefined,
        minHeight: currentHeight ? undefined : 1
    };

    const keyExtractor = useCallback(
        (_: any, index: number) => index.toString(),
        []
    );

    const renderStep = useCallback(
        ({ item, index }: FlashListRenderItemInfo<RenderComponent>) => {

            const isVisited = visitedSteps.has(index);

            return (
                <View
                    onLayout={ (event) => {
                        const { height } = event.nativeEvent.layout;

                        setStepHeights(prev => {
                            if(prev[index] === height) return prev;
                            return { ...prev, [index]: height };
                        });
                    } }
                >
                    { isVisited ? item() : <View style={ { height: 400, width } }/> }
                </View>
            );
        },
        [visitedSteps]
    );

    const renderItem = useCallback(
        ({ item, index }: ListRenderItemInfo<RenderComponent>) => (
            <FlashList
                data={ [item] }
                renderItem={ (info) =>
                    renderStep({ ...info, index })
                }
                keyExtractor={ keyExtractor }
                contentContainerStyle={ { width } }
                nestedScrollEnabled
                showsVerticalScrollIndicator={ false }
                renderScrollComponent={ BottomSheetFlashListScrollable }
            />
        ),
        [width, renderStep, keyExtractor, BottomSheetFlashListScrollable]
    );

    return (
        <FlatList<RenderComponent>
            ref={ flatListRef }
            data={ steps }
            renderItem={ renderItem }
            keyExtractor={ keyExtractor }
            horizontal
            scrollEnabled={ false }
            nestedScrollEnabled
            showsHorizontalScrollIndicator={ false }
            removeClippedSubviews={ false }
            initialNumToRender={ 1 }
            style={ containerStyle }
        />
    );
}

export default OnBoardingView;