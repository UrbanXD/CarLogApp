import { ColorValue, StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

interface IconProps {
    icon: string
    size?: number
    color?: ColorValue | string,
    backgroundColor?: ColorValue | string,
    style?: StyleProp<ViewStyle>
    onPress?: () => void
}

const Icon: React.FC<IconProps> = ({
    icon,
    size = hp(5),
    color,
    backgroundColor = "transparent",
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
            <MaterialIcon
                name={ icon }
                size={ size }
                color={ color }
                style={{ }}
            />
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
            borderRadius: 50,
        }
    })

export default Icon;