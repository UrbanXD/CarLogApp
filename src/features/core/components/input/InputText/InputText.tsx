import React from "react";
import {
    StyleProp,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";
import { Control, Controller } from "react-hook-form";
import { SEPARATOR_SIZES } from "../../../constants/constants";
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
                    render={({ field: { value, onChange }, fieldState: { error }})=>
                        <TextInput
                            value={ value }
                            setValue={ onChange }
                            icon={ icon }
                            placeholder={ placeholder }
                            error={ error?.message }
                            numeric={ numeric }
                            isSecure={ isSecure }
                            isEditable={ isEditable }
                        />
                    }
                />
            }
        </View>
    )
}

export default InputText;