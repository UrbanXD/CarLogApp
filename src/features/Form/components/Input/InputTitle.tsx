import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {FONT_SIZES, GLOBAL_STYLE} from "../../../../constants/constants";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { theme } from "../../../../constants/theme";

interface InputTitleProps {
    title: string,
    subtitle?: string
    optional?: boolean
}

const InputTitle: React.FC<InputTitleProps> = ({
    title,
    subtitle,
    optional = false
}) => {
    return (
        <View>
            <View>
                <Text style={ styles.inputNameText }>
                    {
                        `${title} `
                    }
                    {
                        optional &&
                        <Text style={ styles.optionalText }>
                            (opcionális)
                        </Text>
                    }
                </Text>
            </View>
            {
                subtitle &&
                <Text style={ styles.inputInfoText }>
                    { subtitle }
                </Text>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    inputNameText: {
        fontSize: FONT_SIZES.normal,
        fontFamily: "Gilroy-Heavy",
        color: theme.colors.white
    },
    optionalText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.small,
        color: theme.colors.gray2
    },
    inputInfoText: {
        ...GLOBAL_STYLE.containerText,
    }
})

export default InputTitle;