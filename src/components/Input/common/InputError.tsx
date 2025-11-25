import React from "react";
import { useInputFieldContext } from "../../../contexts/inputField/InputFieldContext.ts";
import { StyleSheet, Text } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { COLORS } from "../../../constants/index.ts";
import { useTranslation } from "react-i18next";

const InputError: React.FC = () => {
    const { t } = useTranslation();
    const inputFieldContext = useInputFieldContext();
    const error = inputFieldContext?.fieldState?.error;

    if(!error) return <></>;

    const [key, ...rest] = error?.message.split(";");
    const values = rest.map(item => item.trim());

    const i18nParams = values.reduce((acc, val, idx) => {
        acc[idx] = val;
        return acc;
    }, {} as Record<number, string>);

    return (
        <Text style={ styles.errorText }>
            { t(key, i18nParams) }
        </Text>
    );
};

const styles = StyleSheet.create({
    errorText: {
        paddingLeft: hp(0.5),
        fontFamily: "Gilroy-Medium",
        fontSize: hp(1.85),
        letterSpacing: hp(1.85) * 0.05,
        color: COLORS.redLight
    }
});

export default InputError;