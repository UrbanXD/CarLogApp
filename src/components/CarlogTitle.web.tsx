import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { COLORS, DEFAULT_SEPARATOR } from "../constants";

const CarlogTitle: React.FC = () => {
    const width = Math.min(450, Dimensions.get("window").width - 2 * DEFAULT_SEPARATOR);

    return (
        <View style={ styles.container }>
            <Text style={ [styles.title, { fontSize: width * 0.19 }] }>CARLOG</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    title: {
        color: COLORS.white,
        fontFamily: "Gilroy-Heavy",
        textAlign: "center",
        lineHeight: 1.1
    }
});

export default CarlogTitle;
