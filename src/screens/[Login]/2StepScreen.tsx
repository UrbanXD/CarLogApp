import React from "react";
import {Text, View} from "react-native";
import Animated, {LightSpeedInLeft, LightSpeedInRight} from "react-native-reanimated";

const Step2Screen: React.FC = () => {
    return (
        <Animated.View entering={LightSpeedInLeft} exiting={LightSpeedInRight} style={{flex: 1}}>
            <Text style={{color: "white"}}>Second</Text>
        </Animated.View>
    )
}

export default Step2Screen;