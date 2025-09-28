import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import React from "react";
import { COLORS, GLOBAL_STYLE, SEPARATOR_SIZES } from "../../../constants/index.ts";

export type PickerItemType = {
    value: string
    title?: string
    subtitle?: string
}

type PickerItemProps = {
    item: PickerItemType
    onPress: () => void
    selected: boolean
    style?: ViewStyle
}

const PickerItem: React.FC<PickerItemProps> = ({
    item: { value, title = value, subtitle, icon },
    onPress,
    selected,
    style
}) => (
    <Pressable
        onPress={ onPress }
        disabled={ selected }
        style={ [styles.itemContainer, selected && styles.selectedItemContainer, style] }
    >
        <View style={ styles.textContainer }>
            <Text style={ styles.titleText }>
                { title }
            </Text>
            {
                subtitle &&
               <Text style={ styles.subtitleText }>
                   { subtitle }
               </Text>
            }
        </View>
    </Pressable>
);

const styles = StyleSheet.create({
    itemContainer: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.gray4,
        borderRadius: 12.5,
        borderWidth: 1.5,
        borderColor: COLORS.gray4,
        paddingVertical: SEPARATOR_SIZES.small,
        paddingHorizontal: SEPARATOR_SIZES.lightSmall
    },
    selectedItemContainer: {
        borderColor: COLORS.gray1
    },
    textContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    titleText: {
        ...GLOBAL_STYLE.containerTitleText,
        fontSize: GLOBAL_STYLE.containerTitleText.fontSize * 0.7,
        letterSpacing: GLOBAL_STYLE.containerTitleText.letterSpacing * 0.7,
        textAlign: "center"
    },
    subtitleText: {
        ...GLOBAL_STYLE.containerText,
        fontSize: GLOBAL_STYLE.containerText.fontSize * 0.8,
        letterSpacing: GLOBAL_STYLE.containerText.letterSpacing * 0.8,
        textAlign: "center"
    }
});

export default React.memo(PickerItem);