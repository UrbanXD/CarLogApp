import React from "react";
import Animated, {SharedValue} from "react-native-reanimated";
import {LinearGradient} from "expo-linear-gradient";
import {theme} from "../../styles/theme";
import hexToRgba from "hex-to-rgba";
import {headerStyles} from "../../styles/headers.style";
import {ImageSourcePropType} from "react-native";

interface HeaderImageProp {
    image: ImageSourcePropType,
    height: SharedValue<number>
}

const HeaderImage: React.FC<HeaderImageProp> = ({ image, height }) => {
    const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

    return (
        <>
            <Animated.Image
                source={image}
                style={{ width: "100%", height: height }}
            />
            <AnimatedLinearGradient
                locations={[ 0.05, 0.5, 0.9 ]}
                colors={[
                    "transparent",
                    hexToRgba(theme.colors.primaryBackground1, 0.25),
                    hexToRgba(theme.colors.primaryBackground1, 0.9)
                    // theme.colors.primaryBackground1
                ]}
                style={[ headerStyles.headerImageGradient, { height }]}
            />
        </>
    )
}

export default HeaderImage;