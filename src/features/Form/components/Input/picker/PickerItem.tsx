import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { FONT_SIZES, GLOBAL_STYLE, SEPARATOR_SIZES } from "../../../../Shared/constants/constants";
import { theme } from "../../../../Shared/constants/theme";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

interface PickerItemProps {
    onPress: () => void
    title: string
    subtitle?: string
    icon?: ImageSourcePropType
    selected: boolean
}

const PickerItem: React.FC<PickerItemProps> = ({
   onPress,
   title,
   subtitle,
   icon,
   selected
}) => {
    return (
        <TouchableOpacity onPress={ onPress } style={ [styles.itemContainer, selected && styles.selectedItemContainer] }>
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
                <View style={ styles.iconContainer } />
            }
        </TouchableOpacity>
    )
}

const styles= StyleSheet.create({
    itemContainer: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.gray4,
        minHeight: hp(6),
        borderRadius: 15,
        paddingHorizontal: SEPARATOR_SIZES.small
    },
    selectedItemContainer: {
        borderWidth: 1.5,
        borderColor: theme.colors.gray1
    },
    iconContainer: {
        flex: 0.25,
        alignItems: "center",
    },
    icon: {
        alignSelf: "center",
        width: FONT_SIZES.large,
        height: FONT_SIZES.large
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
        textAlign: "center",
    },
    subtitleText: {
        ...GLOBAL_STYLE.containerText,
        fontSize: GLOBAL_STYLE.containerText.fontSize * 0.8,
        letterSpacing: GLOBAL_STYLE.containerText.letterSpacing * 0.8,
        textAlign: "center",
    }
})

export default React.memo(PickerItem);