import hexToRgba from "hex-to-rgba";
import {
    StyleSheet,
    View
} from "react-native";
import { theme } from "../../../constants/theme";
import { IconButton } from "react-native-paper";
import {FONT_SIZES, GET_ICON_BUTTON_RESET_STYLE, ICON_NAMES } from "../../../constants/constants";

const DefaultImage: React.FC = () => {
    return (
        <View style={ styles.container }>
            <IconButton
                icon={ ICON_NAMES.image }
                size={ FONT_SIZES.extraLarge }
                iconColor={ theme.colors.gray3 }
                style={ GET_ICON_BUTTON_RESET_STYLE(FONT_SIZES.extraLarge) }
            />
        </View>    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: hexToRgba(theme.colors.gray4, 0.65),
        borderWidth: 0.5,
        borderRadius: 38,
        borderColor: theme.colors.gray3
    }
})

export default DefaultImage;