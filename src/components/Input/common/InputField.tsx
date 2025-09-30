import React, { ReactNode } from "react";
import { Control, Controller, UseControllerReturn } from "react-hook-form";
import { SEPARATOR_SIZES } from "../../../constants/index.ts";
import InputTitle from "./InputTitle.tsx";
import { StyleSheet, View } from "react-native";
import { InputFieldProvider } from "../../../contexts/inputField/InputFieldProvider.tsx";
import InputError from "./InputError.tsx";

interface InputFieldProps {
    control: Control<any>;
    fieldName: string;
    fieldNameText?: string;
    fieldInfoText?: string;
    optional?: boolean;
    children: ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
    control,
    fieldName,
    fieldNameText,
    fieldInfoText,
    optional,
    children
}) => {
    const renderControllerInput = (args: UseControllerReturn<any>) => {
        return (
            <InputFieldProvider value={ { ...args, control: control } }>
                <View>
                    { children }
                </View>
                <InputError/>
            </InputFieldProvider>
        );
    };

    return (
        <View style={ styles.container }>
            {
                fieldNameText &&
               <InputTitle
                  title={ fieldNameText }
                  subtitle={ fieldInfoText }
                  optional={ optional }
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