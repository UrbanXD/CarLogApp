import React from "react";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../constants/index.ts";
import { StyleSheet, Text, View } from "react-native";
import Icon from "../../../components/Icon.tsx";

interface RideInfoProps {
    text: string,
    icon: string
}

const RideInfo: React.FC<RideInfoProps> = ({
    text,
    icon
}) => {
    return (
        <View style={ styles.container }>
            <Icon
                icon={ icon }
                size={ styles.text.fontSize * 1.2 }
                color={ COLORS.white }
            />
            <Text numberOfLines={ 2 } style={ styles.text }>
                { text }
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall,
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        flex: 1,
        flexWrap: "wrap",
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p3,
        color: COLORS.gray1
    }
});

export default RideInfo;