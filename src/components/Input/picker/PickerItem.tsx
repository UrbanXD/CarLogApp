import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS, FONT_SIZES, GLOBAL_STYLE, SEPARATOR_SIZES } from "../../../constants/index.ts";

export type PickerItemType = {
    value: string
    title?: string
    subtitle?: string
    icon?: ImageSourcePropType
}

type PickerItemProps = {
    item: PickerItemType
    onPress: () => void
    selected: boolean
}

const PickerItem: React.FC<PickerItemProps> = ({
    item: { value, title = value, subtitle, icon },
    onPress,
    selected
}) => (
    <TouchableOpacity
        onPress={ onPress }
        disabled={ selected }
        style={ [styles.itemContainer, selected && styles.selectedItemContainer] }
    >
        {
            icon &&
           <View style={ styles.iconContainer }>
              <Image
                 source={ icon }
                 style={ styles.icon }
              />
           </View>
        }
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
        {
            icon &&
           <View style={ styles.iconContainer }/>
        }
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    itemContainer: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.gray4,
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: COLORS.gray4,
        paddingVertical: SEPARATOR_SIZES.small,
        paddingHorizontal: SEPARATOR_SIZES.lightSmall
    },
    selectedItemContainer: {
        borderColor: COLORS.gray1
    },
    iconContainer: {
        flex: 0.25,
        alignItems: "center"
    },
    icon: {
        alignSelf: "center",
        width: FONT_SIZES.h1,
        height: FONT_SIZES.h1
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