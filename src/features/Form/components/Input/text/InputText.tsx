import React, {useEffect} from "react";
import {
    StyleProp,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";
import { Control, Controller } from "react-hook-form";
import {ControllerRenderArgs, SEPARATOR_SIZES} from "../../../../Shared/constants/constants";
import InputTitle from "../InputTitle";
import TextInput from "./TextInput";

interface InputTextProps {
    control: Control<any>
    fieldName: string
    fieldNameText?: string
    fieldInfoText?: string
    icon?: string
    placeholder?: string
    numeric?: boolean
    isSecure?: boolean
    isEditable?: boolean
    style?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
    isInBottomSheet?: boolean
}

const InputText: React.FC<InputTextProps> = ({
    control,
    fieldName,
    fieldNameText,
    fieldInfoText,
    icon,
    placeholder = "",
    numeric = false,
    isSecure= false,
    isEditable = true,
    style,
    textStyle,
    isInBottomSheet = false
}) => {
    return (
        <View style={{ flexDirection: "column", gap: SEPARATOR_SIZES.lightSmall }}>
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
                    render={(args: ControllerRenderArgs) => {
                        const { field: { value, onChange }, fieldState: { error } } = args;

                        useEffect(() => {
                            onChange(value.toString());
                        }, []);

                        return (
                            <TextInput
                                setValue={ onChange }
                                value={ value.toString() }
                                icon={ icon }
                                placeholder={ placeholder }
                                error={ error?.message }
                                numeric={ numeric }
                                isSecure={ isSecure }
                                isEditable={ isEditable }
                            />
                        )
                    }
                    }
                />
            }
        </View>
    )
}

export default InputText;