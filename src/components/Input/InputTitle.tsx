import React, {useEffect} from "react";
import {StyleSheet, Text, View} from "react-native";
import {GLOBAL_STYLE, SEPARATOR_SIZES} from "../../constants/constants";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import {theme} from "../../constants/theme";

interface InputTitleProps {
    title: string,
    subtitle?: string
}

const InputTitle: React.FC<InputTitleProps> = ({ title, subtitle }) => {
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
        paddingLeft: SEPARATOR_SIZES.lightSmall,
        fontSize: hp(2.75),
        fontFamily: "Gilroy-Heavy",
        color: theme.colors.white
    },
    inputInfoText: {
        ...GLOBAL_STYLE.containerText,
        paddingLeft: SEPARATOR_SIZES.lightSmall
    }
})

export default InputTitle