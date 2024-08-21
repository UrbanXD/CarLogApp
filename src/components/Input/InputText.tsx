import React, {useState} from "react";
import {StyleProp, StyleSheet, TextInput, TextStyle, Text, View, ViewStyle} from "react-native";
import {Control, Controller, FieldError, FieldValues} from "react-hook-form";
import {GLOBAL_STYLE, ICON_COLORS, ICON_NAMES} from "../../constants/constants";
import {Divider, Icon, IconButton} from "react-native-paper";
import {heightPercentageToDP as hp, heightPercentageToDP} from "react-native-responsive-screen";
import {theme} from "../../constants/theme";

interface InputTextProps {
    control: Control<any>
    fieldName: string
    fieldNameText?: string
    icon?: string
    placeholder?: string
    isSecure?: boolean
    isEditable?: boolean
    style?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
}

const InputText: React.FC<InputTextProps> = ({ control, fieldName, fieldNameText = fieldName, icon, placeholder = "", isSecure= false, isEditable = true, style, textStyle,  }) => {
    const [focused, setFocused] = useState(false);
    const [secure, setSecure] = useState(isSecure);

    const changeSecure = () => setSecure(!secure);

    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);
    // console.log(fieldName, control._formValues[fieldName])
    return (
        <View style={ styles.inputContainer }>
            <Text style={ styles.inputName }>{ fieldNameText }</Text>
            <Controller
                control={ control }
                name={ fieldName }
                render={({ field: { value, onChange }, fieldState: { error }})=>
                    <>
                        <View style={ [style, isEditable && styles.formFieldContainer, focused && isEditable && styles.activeFormFieldContainer] }>
                            {
                                icon &&
                                <View style={ styles.formFieldIconContainer }>
                                    <Icon source={ icon } size={ heightPercentageToDP(4.5) } color={ styles.textInput.color } />
                                </View>
                            }
                            {/*<Divider style={{backgroundColor: "red", width:2}} horizontalInset={true}  />*/}
                            <TextInput
                                placeholder={ placeholder }
                                style={ [textStyle, styles.textInput] }
                                placeholderTextColor={ styles.placeholderText.color }
                                value={ value }
                                secureTextEntry={ secure }
                                onChangeText={ onChange }
                                onBlur={ onBlur }
                                onFocus={ onFocus }
                                editable={ isEditable }
                            />
                            <View style={ styles.formFieldIconContainer }>
                                {
                                    isSecure &&
                                    <IconButton
                                        icon={ secure ? ICON_NAMES.eyeOff : ICON_NAMES.eye }
                                        size={ hp(3.25) }
                                        iconColor={ ICON_COLORS.default }
                                        onPress={ changeSecure }
                                    />
                                }
                            </View>
                        </View>
                        { error && <Text style={ styles.errorText }>{ error.message }</Text> }
                    </>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "column",
        gap: 5
    },
    inputName: {
        paddingLeft: hp(2),
        fontSize: hp(2.75),
        fontFamily: "Gilroy-Heavy",
        color: theme.colors.white
    },
    formFieldContainer: {
        minHeight: hp(6),
        maxHeight: hp(6),
        flexDirection: "row",
        alignItems: "center",
        gap: hp(1.5),
        backgroundColor: theme.colors.gray4,
        paddingHorizontal: hp(1.5),
        borderRadius: 20,
        overflow: "hidden"
    },
    activeFormFieldContainer: {
        borderWidth: 1,
        borderColor: theme.colors.gray1
    },
    formFieldIconContainer: {
        flex: 0.2,
        alignItems: "center",
    },
    textInput: {
        flex: 1,
        color: theme.colors.gray1,
        // fontFamily: "Gilroy-Medium",
        fontSize: hp(2.25)
    },
    placeholderText: {
        color: theme.colors.gray2
    },
    errorText: {
        paddingLeft: hp(2),
        fontFamily: "Gilroy-Medium",
        fontSize: hp(1.85),
        letterSpacing: hp(1.85) * 0.05,
        color: theme.colors.redLight
    }
})

export default InputText;