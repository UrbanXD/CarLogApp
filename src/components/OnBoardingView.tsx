import React, { useCallback, useEffect, useRef } from "react";
import { FlatList } from "react-native-gesture-handler";
import { useWindowDimensions, View } from "react-native";
import { DEFAULT_SEPARATOR } from "../constants/index.ts";
import { RenderComponent } from "../types/index.ts";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

type OnBoardingViewProps = {
    steps: RenderComponent;
    currentStep?: number;
}

const OnBoardingView: React.FC<OnBoardingViewProps> = ({
    steps,
    currentStep = 0
}) => {
    const scrollViewRef = useRef<FlatList>(null);

    const width = useWindowDimensions().width - 2 * DEFAULT_SEPARATOR;

    useEffect(() => {
        scrollViewRef.current?.scrollToOffset({ offset: currentStep * width, animated: true });
    }, [scrollViewRef, currentStep, width]);

    const renderSteps = useCallback(() => (
        <View style={ { flexDirection: "row" } }>
            {
                steps.map((step, index) =>
                    <View
                        key={ index }
                        style={ { width } }
                    >
                        <BottomSheetScrollView showsVerticalScrollIndicator={ false }>
                            { step() }
                        </BottomSheetScrollView>
                    </View>
                )
            }
        </View>
    ), [currentStep, steps]);

    return (
        <FlatList
            data={ [] }
            renderItem={ () => <></> }
            ListEmptyComponent={ renderSteps() }
            ref={ scrollViewRef }
            scrollEnabled={ false }
            horizontal
            snapToInterval={ width }
            showsHorizontalScrollIndicator={ false }
            showsVerticalScrollIndicator={ false }
            decelerationRate="fast"
            bounces={ false }
            bouncesZoom={ false }
            renderToHardwareTextureAndroid
        />
    );
};

export default OnBoardingView;