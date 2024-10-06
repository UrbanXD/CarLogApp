import {Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {DEFAULT_SEPARATOR, FONT_SIZES, GLOBAL_STYLE, SEPARATOR_SIZES} from "../../../constants/constants";
import {exp} from "@gorhom/bottom-sheet/lib/typescript/utilities/easingExp";
import {theme} from "../../../constants/theme";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";

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
        <TouchableOpacity onPress={ onPress } style={ [styles.inputPickerItemContainer, selected && styles.inputPickerSelectedItemContainer] }>
            {
                icon &&
                <View style={ styles.inputPickerItemIconContainer }>
                    <Image
                        source={ icon }
                        style={{ alignSelf: "center", width: FONT_SIZES.large, height: FONT_SIZES.large }}
                    />
                </View>
            }
            <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={ styles.inputPickerTitleText }>
                    { title }
                </Text>
                {
                    subtitle &&
                    <Text style={ styles.inputPickerSubtitleText }>
                        { subtitle }
                    </Text>
                }
            </View>
            {
                icon &&
                <View style={ styles.inputPickerItemIconContainer } />
            }
        </TouchableOpacity>
    )
}

const styles= StyleSheet.create({
    inputPickerItemContainer: {
        flex: 1,
        flexDirection: "row",
        // justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.gray3,
        minHeight: hp(6),
        borderRadius: 15,
        paddingHorizontal: SEPARATOR_SIZES.lightSmall
    },
    inputPickerSelectedItemContainer: {
        borderWidth: 1.5,
        borderColor: theme.colors.gray1
    },
    inputPickerItemIconContainer: {
        flex: 0.25,
        alignItems: "center",
    },
    inputPickerTitleText: {
        ...GLOBAL_STYLE.containerTitleText,
        fontSize: GLOBAL_STYLE.containerTitleText.fontSize * 0.7,
        letterSpacing: GLOBAL_STYLE.containerTitleText.letterSpacing * 0.7,
        textAlign: "center"
    },
    inputPickerSubtitleText: {
        ...GLOBAL_STYLE.containerText,
        fontSize: GLOBAL_STYLE.containerText.fontSize * 0.8,
        letterSpacing: GLOBAL_STYLE.containerText.letterSpacing * 0.8,
        textAlign: "center"
    }
})

export default PickerItem;