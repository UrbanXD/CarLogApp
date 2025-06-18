import React, {useEffect} from "react";
import { View } from "react-native";
import { Control, Controller } from "react-hook-form";
import { ControllerRenderArgs, SEPARATOR_SIZES } from "../../../constants/index.ts";
import InputTitle from "../InputTitle.tsx";
import TextInput from "./TextInput.tsx";

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
    isEditable = true
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
                            if(value) onChange(value.toString());
                        }, []);

                        return (
                            <TextInput
                                setValue={ onChange }
                                value={ value ? value.toString() : "" }
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