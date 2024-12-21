import {
    StyleSheet,
    View
} from "react-native";
import { theme } from "../../../constants/theme";
import { FONT_SIZES, ICON_NAMES } from "../../../constants/constants";
import Icon from "../../shared/Icon";
import { hexToRgba } from "../../../utils/colors/hexToRgba";

const DefaultImage: React.FC = () => {
    return (
        <View style={ styles.container }>
            <Icon
                icon={ ICON_NAMES.image }
                size={ FONT_SIZES.extraLarge }
                color={ theme.colors.gray3 }
            />
        </View>
    )
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