import React, { useCallback, useEffect, useRef, useState } from "react";
import { ListRenderItemInfo, Platform, ScrollView, useWindowDimensions, View } from "react-native";
import { DEFAULT_SEPARATOR } from "../constants";
import { RenderComponent } from "../types";
import { useBottomSheetInternal, useBottomSheetScrollableCreator } from "@gorhom/bottom-sheet";
import { FlatList } from "react-native-gesture-handler";
import { FlashList, ListRenderItemInfo as FlashListRenderItemInfo } from "@shopify/flash-list";

type OnBoardingViewProps = {
    steps: Array<RenderComponent>
    currentStep?: number
    renderCurrentStepOnly?: boolean
}

const CurrentStep: React.FC<{ render: RenderComponent }> = ({ render }) => <>{ render() }</>;

export function OnBoardingView({
    steps,
    currentStep = 0,
    renderCurrentStepOnly = false
}: OnBoardingViewProps) {
    const isBottomSheet = !!useBottomSheetInternal(true);
    const BottomSheetFlashListScrollable = isBottomSheet
                                           ? useBottomSheetScrollableCreator()
                                           : undefined;

    const flatListRef = useRef<FlatList>(null);

    const { width: windowWidth } = useWindowDimensions();
    const [measuredWidth, setMeasuredWidth] = useState(0);
    // On web this list lives inside a modal. Using the viewport width here makes
    // every step wider than the modal and causes its fields/buttons to overflow.
    const width = Platform.OS === "web"
                  ? measuredWidth
                  : windowWidth - 2 * DEFAULT_SEPARATOR;

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
        height: Platform.OS === "web" ? undefined : currentHeight ?? undefined,
        minHeight: Platform.OS === "web" ? 0 : currentHeight ? undefined : 1,
        flex: Platform.OS === "web" ? 1 : undefined
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
                    style={ Platform.OS === "web" ? { width, minWidth: 0, maxWidth: "100%" } : undefined }
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
        [visitedSteps, width]
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
                style={ Platform.OS === "web" ? { width, minWidth: 0, maxWidth: "100%" } : undefined }
                nestedScrollEnabled
                showsVerticalScrollIndicator={ false }
                renderScrollComponent={ BottomSheetFlashListScrollable }
            />
        ),
        [width, renderStep, keyExtractor, BottomSheetFlashListScrollable]
    );

    const list = (
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
            style={ [containerStyle, Platform.OS === "web" && { width, minWidth: 0, maxWidth: "100%" }] }
        />
    );

    if(Platform.OS === "web" && renderCurrentStepOnly) {
        return (
            <ScrollView
                style={ {
                    flex: 1,
                    width: "100%",
                    minWidth: 0,
                    minHeight: 0,
                    maxWidth: "100%"
                } }
                contentContainerStyle={ {
                    flexGrow: 1,
                    width: "100%",
                    minWidth: 0
                } }
                showsVerticalScrollIndicator={ false }
            >
                { steps[currentStep] && <CurrentStep key={ currentStep } render={ steps[currentStep] }/> }
            </ScrollView>
        );
    }

    if(Platform.OS !== "web") return list;

    return (
        <View
            onLayout={ ({ nativeEvent }) => {
                const nextWidth = nativeEvent.layout.width;
                setMeasuredWidth(previous => Math.abs(previous - nextWidth) < 1 ? previous : nextWidth);
            } }
            style={ {
                width: "100%",
                minWidth: 0,
                maxWidth: "100%",
                minHeight: 0,
                flex: 1,
                alignSelf: "stretch",
                overflow: "hidden"
            } }
        >
            { list }
        </View>
    );
}

export default OnBoardingView;
