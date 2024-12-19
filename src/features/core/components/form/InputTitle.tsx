import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GLOBAL_STYLE, SEPARATOR_SIZES } from "../../constants/constants";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { theme } from "../../constants/theme";

interface InputTitleProps {
    title: string,
    subtitle?: string
}

const InputTitle: React.FC<InputTitleProps> = ({
    title,
    subtitle
}) => {
    return (
        <View>
            <Text style={ styles.inputNameText }>
                { title }
            </Text>
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
        fontSize: hp(2.75),
        fontFamily: "Gilroy-Heavy",
        color: theme.colors.white
    },
    inputInfoText: {
        ...GLOBAL_STYLE.containerText,
    }
})

export default InputTitle;