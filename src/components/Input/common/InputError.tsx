import React from "react";
import { useInputFieldContext } from "../../../contexts/inputField/InputFieldContext.ts";
import { StyleSheet, Text } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { COLORS } from "../../../constants/index.ts";

const InputError: React.FC = () => {
    const inputFieldContext = useInputFieldContext();
    const error = inputFieldContext?.fieldState?.error;

    if(!error) return <></>;
    return (
        <Text style={ styles.errorText }>
            { error.message }
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