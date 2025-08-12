import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { ListRenderItemInfo, useWindowDimensions } from "react-native";
import { DEFAULT_SEPARATOR } from "../constants/index.ts";
import { RenderComponent } from "../types/index.ts";

type OnBoardingViewProps = {
    steps: RenderComponent
    currentStep?: number
}

const OnBoardingView: React.FC<OnBoardingViewProps> = ({
    steps,
    currentStep = 0
}) => {
    const scrollViewRef = useRef<FlatList>(null);

    const [highestStep, setHighestStep] = useState(0);

    const width = useWindowDimensions().width - 2 * DEFAULT_SEPARATOR;

    useEffect(() => {
        scrollViewRef.current?.scrollToOffset({ offset: currentStep * width, animated: true });
    }, [scrollViewRef, currentStep, width]);

    useEffect(() => {
        if(currentStep > highestStep) setHighestStep(currentStep); // to prerender the next item
    }, [currentStep]);

    const renderItem = useCallback(({ item, index }: ListRenderItemInfo<any>) => (
        <ScrollView
            nestedScrollEnabled
            contentContainerStyle={ { width } }
            showsVerticalScrollIndicator={ false }
        >
            { index <= highestStep ? item() : <></> }
        </ScrollView>
    ), [width, highestStep]);

    return (
        <FlatList
            data={ steps }
            horizontal
            pagingEnabled
            ref={ scrollViewRef }
            renderItem={ renderItem }
            keyExtractor={ (_, index) => index.toString() }
            snapToInterval={ width }
            decelerationRate="fast"
            nestedScrollEnabled
            scrollEnabled={ false }
            bounces={ false }
            showsHorizontalScrollIndicator={ false }
        />
    );
};

export default OnBoardingView;