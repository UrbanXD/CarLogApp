import { ColorValue, StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { SEPARATOR_SIZES } from "../../constants/constants";

interface IconProps {
    icon: string
    size?: number
    color?: ColorValue | string,
    backgroundColor?: ColorValue | string,
    onPress?: () => void
}

const Icon: React.FC<IconProps> = ({
    icon,
    size = hp(5),
    color,
    backgroundColor = "transparent",
    onPress
}) => {
    const styles = useStyles(size, backgroundColor);

    return (
        <TouchableOpacity
            style={ styles.container }
            onPress={ onPress }
            disabled={ !onPress }
        >
            <MaterialIcon
                name={ icon }
                size={ size }
                color={ color }
                style={{ zIndex: 99 }}
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
            // padding: backgroundColor === "transparent" ? 0 : SEPARATOR_SIZES.lightSmall
        }
    })

export default Icon;