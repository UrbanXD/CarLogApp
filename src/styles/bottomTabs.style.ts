import {Dimensions, StyleSheet} from "react-native";
import { theme } from "./theme";
import Constants from "expo-constants";

const colors = theme.colors;

export const bottomTabColors = {
    activeIcon: "whitesmoke",
    inactiveIcon: colors.xd
}

export const bottomTabStyles = StyleSheet.create({
    bottomStyle: {
        // position:"relative",
        height: 72,
        backgroundColor: theme.colors.primaryBackground1,
        borderColor: "whitesmoke",
    },
    style: {
        position: "absolute",
        alignSelf: "center",
        flexDirection:"row",
        justifyContent: "space-around",
        alignItems: "center",
        height: 72,
        borderRadius: 50,
        backgroundColor: theme.colors.primaryBackground1,
        borderColor: theme.colors.secondaryBackground,
        borderWidth: 2.5,
    },
    titleStyle: {
        fontSize: 16
    },
    slidingElementContainerStyle: {
        ...StyleSheet.absoluteFillObject,
        top: -3,
        paddingHorizontal: 50,
    },
    slidingElementStyle: {
        width: "100%",
        height: 5,
        backgroundColor: "red"
    }
});