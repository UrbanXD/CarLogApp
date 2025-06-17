import React, { useEffect, useRef } from "react";
import { FlatList } from "react-native-gesture-handler";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { DEFAULT_SEPARATOR } from "../constants/index.ts";
import { RenderComponent } from "../features/Form/constants/types/types.ts";

interface OnBoardingViewProps {
    steps: RenderComponent
    currentStep?: number
    visibleHeight?: number
}

const OnBoardingView: React.FC<OnBoardingViewProps> = ({
    steps,
    currentStep = 0,
    visibleHeight
}) => {
    const scrollViewRef = useRef<FlatList>(null);

    const width =  useWindowDimensions().width;
    useEffect(() => {
        scrollViewRef.current?.scrollToOffset({ offset: currentStep * width, animated: true });
    }, [scrollViewRef, currentStep, width]);

    const styles = StyleSheet.create({
       container: {
           flexDirection: "row",
           gap: 2 * DEFAULT_SEPARATOR
       },
       stepContainer: {
           width: width - 2 * DEFAULT_SEPARATOR, // - 2*gap
       }
    });

    return (
        <FlatList
            data={ [] }
            renderItem={ () => <></> }
            ListEmptyComponent={
                <View style={ styles.container }>
                    {
                        steps.map(
                            (step, index) =>
                                <View
                                    key={ index }
                                    style={[
                                        styles.stepContainer, {
                                            height: visibleHeight && currentStep !== index ? visibleHeight : "100%"
                                        }
                                    ]}
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