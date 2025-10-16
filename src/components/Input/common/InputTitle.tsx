import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../constants/index.ts";

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
        <View style={ styles.container }>
            <View>
                <Text style={ styles.inputNameText }>
                    {
                        `${ title } `
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
    );
};

const styles = StyleSheet.create({
    container: {
        gap: SEPARATOR_SIZES.lightSmall / 2
    },
    inputNameText: {
        fontSize: FONT_SIZES.p1,
        fontFamily: "Gilroy-Heavy",
        letterSpacing: FONT_SIZES.p1 * 0.025,
        color: COLORS.white
    },
    optionalText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p3,
        lineHeight: FONT_SIZES.p1,
        letterSpacing: FONT_SIZES.p3 * 0.05,
        color: COLORS.gray1
    },
    inputInfoText: {
        fontSize: FONT_SIZES.p3,
        fontFamily: "Gilroy-Medium",
        color: COLORS.gray1,
        lineHeight: FONT_SIZES.p2 * 1.2,
        letterSpacing: FONT_SIZES.p2 * 0.05
    }
});

export default InputTitle;