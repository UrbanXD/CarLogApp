import React, { useEffect, useRef, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { useWindowDimensions, View } from "react-native";
import { DEFAULT_SEPARATOR } from "../constants/index.ts";
import { RenderComponent } from "../types/index.ts";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

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

    return (
        <FlatList
            data={ steps }
            horizontal
            pagingEnabled
            ref={ scrollViewRef }
            renderItem={ ({ item, index }) => (
                <View style={ { width } }>
                    <BottomSheetScrollView showsVerticalScrollIndicator={ false }>
                        { index <= highestStep ? item() : <></> }
                    </BottomSheetScrollView>
                </View>
            ) }
            keyExtractor={ (_, index) => index.toString() }
            snapToInterval={ width }
            decelerationRate="fast"
            scrollEnabled={ false }
            bounces={ false }
            showsHorizontalScrollIndicator={ false }
        />
    );
};

export default OnBoardingView;