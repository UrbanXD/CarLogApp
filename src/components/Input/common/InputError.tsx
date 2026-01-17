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

    let rawMessage: string | undefined;

    if(typeof error === "object" && "message" in error && typeof error.message === "string") {
        rawMessage = error.message;
    } else if(typeof error === "object") {
        const childErrors = Object.values(error).filter(Boolean) as any[];

        if(childErrors.length > 0) {
            const firstChildError = childErrors[0];
            if(typeof firstChildError === "object" && "message" in firstChildError && typeof firstChildError.message === "string") {
                rawMessage = firstChildError.message;
            }
        }
    }

    if(!rawMessage) return <></>;

    const [key, ...rest] = rawMessage.split(";");
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