import React, { ReactNode, useEffect, useRef } from "react";
import { FlatList } from "react-native-gesture-handler";
import { useWindowDimensions, View } from "react-native";
import { DEFAULT_SEPARATOR } from "../constants/constants";

interface OnBoardingViewProps {
    steps: Array<() => ReactNode>
    currentStep?: number
}

const OnBoardingView: React.FC<OnBoardingViewProps> = ({
    steps,
    currentStep = 0
}) => {
    const scrollViewRef = useRef<FlatList>(null);

    const width =  useWindowDimensions().width;
    useEffect(() => {
        scrollViewRef.current?.scrollToOffset({ offset: currentStep * width, animated: true });
    }, [scrollViewRef, currentStep, width]);


    return (
        <FlatList
            data={ [] }
            renderItem={ () => <></> }
            ListEmptyComponent={
                <View style={{ flexDirection: "row", gap: 2 * DEFAULT_SEPARATOR }}>
                    {
                        steps.map(
                            (step, index) =>
                                <View
                                    key={ index }
                                    style={{ width: width - 2 * DEFAULT_SEPARATOR }}
                                >
                                    { step() }
                                </View>
                        )
                    }
                </View>
            }
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
    )
}

export default OnBoardingView;