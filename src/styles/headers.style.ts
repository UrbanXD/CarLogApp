import { StyleSheet } from "react-native";
import { theme } from "./theme";

const colors = theme.colors;

export const headerFontSizes = {
    icon: 28
}

export const headerIconColors = {
    light: colors.primaryColor
}

export const headerStyles = StyleSheet.create({
    titleStyle: {
        color: colors.primaryColor,
        fontSize: 20,
    },
    simpleStyle: {
        flex: 1,
        backgroundColor: colors.primaryBackground1,
        // marginRight: 50
    },
    transparentStyle: {
        flex: 1,
        backgroundColor: colors.homePageBackground
    },
    headerBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    headerImageGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 10,
    },
    headerTitleContainer: {
        gap: 15,
        flexDirection: "row",
        alignItems: "center",
    },
    headerTitleLogo: {
        width: 50,
        height: 50,
        alignSelf: "center"
    },
})