import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, GLOBAL_STYLE } from "../../constants/index.ts";

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
    inputNameText: {
        fontSize: FONT_SIZES.p1,
        fontFamily: "Gilroy-Heavy",
        color: COLORS.white
    },
    optionalText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p3,
        color: COLORS.gray2
    },
    inputInfoText: {
        ...GLOBAL_STYLE.containerText
    }
});

export default InputTitle;