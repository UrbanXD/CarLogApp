import React, { ReactNode } from "react";
import { Control, Controller } from "react-hook-form";
import { ControllerRenderArgs, SEPARATOR_SIZES } from "../../../constants/index.ts";
import InputTitle from "./InputTitle.tsx";
import { StyleSheet, View } from "react-native";
import { InputFieldProvider } from "../../../contexts/inputField/InputFieldProvider.tsx";

interface InputFieldProps {
    control: Control<any>;
    fieldName: string;
    fieldNameText?: string;
    fieldInfoText?: string;
    children: ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
    control,
    fieldName,
    fieldNameText,
    fieldInfoText,
    children
}) => {
    const renderControllerInput = (args: ControllerRenderArgs) => {
        return (
            <InputFieldProvider value={ args }>
                { children }
            </InputFieldProvider>
        );
    };

    return (
        <View style={ { flexDirection: "column", gap: SEPARATOR_SIZES.lightSmall } }>
            {
                fieldNameText &&
               <InputTitle
                  title={ fieldNameText }
                  subtitle={ fieldInfoText }
               />
            }
            {
                <Controller
                    control={ control }
                    name={ fieldName }
                    render={ renderControllerInput }
                />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        gap: SEPARATOR_SIZES.lightSmall
    }
});

export default InputField;