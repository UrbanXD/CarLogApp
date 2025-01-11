import React, {ReactNode, useEffect, useRef} from "react";
import {FlatList} from "react-native-gesture-handler";
import {useWindowDimensions, View} from "react-native";
import {widthPercentageToDP} from "react-native-responsive-screen";
import {SEPARATOR_SIZES} from "../Shared/constants/constants";

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
            data={[]}
            renderItem={() => <></>}
            ListEmptyComponent={
                <>
                    {
                        steps.map(
                            (step, index) =>
                                <View
                                    key={ index }
                                    style={{ width: "100%" }}
                                >
                                    { step() }
                                </View>
                        )
                    }
                </>
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
            contentContainerStyle={{ flex: 1 }}
        />
    )
}

export default OnBoardingView;