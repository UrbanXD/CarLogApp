import React, {useState} from "react";
import {StyleProp, StyleSheet, TextInput, TextStyle, Text, View, ViewStyle} from "react-native";
import {Control, Controller, FieldValues} from "react-hook-form";
import {GLOBAL_STYLE, ICON_COLORS, ICON_NAMES} from "../../constants/constants";
import {Divider, Icon} from "react-native-paper";
import {heightPercentageToDP} from "react-native-responsive-screen";
import {theme} from "../../styles/theme";

interface InputTextProps {
    control: Control<any>
    fieldName: string
    fieldNameText?: string,
    icon?: string,
    placeholder?: string
    isSecure?: boolean,
    style?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
}

const InputText: React.FC<InputTextProps> = ({ control, fieldName, fieldNameText = fieldName, icon, placeholder = "", isSecure= false, style, textStyle,  }) => {
    const [focused, setFocused] = useState(false);

    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);

    return (
        <View style={ GLOBAL_STYLE.inputContainer }>
            <Text style={ GLOBAL_STYLE.inputName }>{ fieldNameText }</Text>
            <Controller
                control={ control }
                name={ fieldName }
                render={({ field: { value, onChange }, fieldState: { error }})=>
                    <View style={ [style, GLOBAL_STYLE.formFieldContainer, focused && GLOBAL_STYLE.activeFormFieldContainer] }>
                        {
                            icon &&
                            <View style={ GLOBAL_STYLE.formFieldIconContainer }>
                                <Icon source={ icon } size={ heightPercentageToDP(4.5) } color={ GLOBAL_STYLE.textInput.color }></Icon>
                            </View>
                        }
                        {/*<Divider style={{backgroundColor: "red", width:2}} horizontalInset={true}  />*/}
                        <TextInput
                            placeholder={ placeholder }
                            style={ [textStyle, GLOBAL_STYLE.textInput] }
                            placeholderTextColor={ GLOBAL_STYLE.placeholderText.color }
                            value={ value }
                            secureTextEntry={ isSecure }
                            onChangeText={ onChange }
                            onBlur={ onBlur }
                            onFocus={ onFocus }
                        />
                        <View style={ GLOBAL_STYLE.formFieldIconContainer }>
                            { focused && <Icon source={ ICON_NAMES.checkMark } size={ heightPercentageToDP(3.5) } color={ ICON_COLORS.good }></Icon> }
                        </View>
                    </View>
                }
            />
        </View>
    )
}

export default InputText;