import React, { ReactNode } from "react";
import { Control, Controller, UseControllerReturn } from "react-hook-form";
import { SEPARATOR_SIZES } from "../../../constants/index.ts";
import InputTitle from "./InputTitle.tsx";
import { StyleSheet, View, ViewStyle } from "react-native";
import { InputFieldProvider } from "../../../contexts/inputField/InputFieldProvider.tsx";
import InputError from "./InputError.tsx";

type InputFieldProps = {
    control: Control<any>
    fieldName: string
    fieldNameText?: string
    fieldInfoText?: string
    optional?: boolean
    containerStyle?: ViewStyle
    style?: ViewStyle
    children: ReactNode
}

function InputField({
    control,
    fieldName,
    fieldNameText,
    fieldInfoText,
    optional,
    containerStyle,
    style,
    children
}: InputFieldProps) {
    const renderControllerInput = (args: UseControllerReturn<any>) => {
        return (
            <InputFieldProvider value={ { ...args, control: control } }>
                <View style={ containerStyle }>
                    { children }
                </View>
                <InputError/>
            </InputFieldProvider>
        );
    };

    return (
        <View style={ [styles.container, style] }>
            {
                fieldNameText &&
               <InputTitle
                  title={ fieldNameText }
                  subtitle={ fieldInfoText }
                  optional={ optional }
               />
            }
            <Controller
                control={ control }
                name={ fieldName }
                render={ renderControllerInput }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        gap: SEPARATOR_SIZES.lightSmall
    }
});

export default InputField;