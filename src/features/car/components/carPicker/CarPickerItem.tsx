import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../constants/index.ts";

type CarPickerItemProps = {
    onPress: () => void
    name: string
    model?: string
    selected: boolean
}

function PickerItem({
    onPress,
    name,
    model,
    selected
}: CarPickerItemProps) {
    return (
        <Pressable onPress={ onPress } style={ [styles.container, selected && styles.container.selected] }>
            <View style={ styles.textContainer }>
                <Text style={ styles.textContainer.name } numberOfLines={ 1 }>
                    { name }
                </Text>
                {
                    model &&
                   <Text style={ styles.textContainer.model } numberOfLines={ 1 }>
                       { model }
                   </Text>
                }
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        height: "80%",
        backgroundColor: COLORS.gray4,
        padding: SEPARATOR_SIZES.lightSmall,
        borderRadius: 10,

        selected: {
            borderWidth: 1.5,
            borderColor: COLORS.gray1
        }
    },
    textContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",

        name: {
            fontFamily: "Gilroy-Heavy",
            fontSize: FONT_SIZES.p4,
            letterSpacing: FONT_SIZES.p4 * 0.05,
            color: COLORS.white,
            textAlign: "center"
        },

        model: {
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.p4 * 0.95,
            letterSpacing: FONT_SIZES.p4 * 0.95 * 0.05,
            color: COLORS.gray1,
            textAlign: "center"
        }
    }
});

export const CarPickerItem = React.memo(PickerItem);