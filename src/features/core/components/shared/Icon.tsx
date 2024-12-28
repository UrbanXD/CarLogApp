import {ColorValue, Image, ImageSourcePropType, StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import React from "react";
import getContrastingColor from "../../utils/colors/getContrastingColor";
import {theme} from "../../constants/theme";

interface IconProps {
    icon: ImageSourcePropType | string
    size?: number
    color?: ColorValue | string,
    backgroundColor?: ColorValue | string,
    style?: StyleProp<ViewStyle>
    onPress?: () => void
}

const Icon: React.FC<IconProps> = ({
    icon,
    size = hp(5),
    backgroundColor = "transparent",
    color = getContrastingColor(backgroundColor, theme.colors.white, theme.colors.black),
    style,
    onPress
}) => {
    const styles = useStyles(size, backgroundColor);

    return (
        <TouchableOpacity
            style={ [styles.container, style] }
            onPress={ onPress }
            disabled={ !onPress }
        >
            {
                typeof icon === "string"
                    ?   <MaterialIcon
                            name={ icon }
                            size={ size }
                            color={ color }
                        />
                    :   <Image
                            source={ icon }
                            style={ styles.imageIcon }
                        />
            }
        </TouchableOpacity>
    )
}

const useStyles = (size: number, backgroundColor: ColorValue | string) =>
    StyleSheet.create({
        container: {
            width: size,
            height: size,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor,
            borderRadius: 100,
        },
        imageIcon: {
            alignSelf: "center",
            width: size,
            height: size,
            backgroundColor
        }
    })

export default Icon;