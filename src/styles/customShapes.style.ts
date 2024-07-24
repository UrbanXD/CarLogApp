import { StyleSheet } from "react-native";

export const customShapesStyle = StyleSheet.create({
    trapezoid: {
        width: 130,
        height: 0,
        borderBottomWidth: 75,
        borderBottomColor: "red",
        borderLeftWidth: 25,
        borderLeftColor: "transparent",
        borderRightWidth: 25,
        borderRightColor: "transparent",
        borderStyle: "solid",
        transform: [{
            rotate: "90deg",
        }],
        transformOrigin: "left",
        marginBottom: 0,
        backgroundColor: "blue",
        marginLeft: 37.5,
        marginTop: -35,
    }
})