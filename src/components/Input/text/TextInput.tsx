import React, { RefObject, useCallback, useState } from "react";
import {
    NativeSyntheticEvent,
    StyleSheet,
    TextInput as TextInputRN,
    TextInputContentSizeChangeEventData,
    TextInputFocusEventData,
    TextStyle,
    View,
    ViewStyle
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { ICON_NAMES, SEPARATOR_SIZES } from "../../../constants/index.ts";
import Icon from "../../Icon.tsx";
import { useInputFieldContext } from "../../../contexts/inputField/InputFieldContext.ts";
import { useBottomSheetInternal } from "@gorhom/bottom-sheet";
import { formTheme } from "../../../ui/form/constants/theme.ts";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export type TextInputProps = {
    inputRef?: RefObject<TextInputRN | null>
    type?: "primary" | "secondary"
    value?: string
    setValue?: (text: string) => void
    icon?: string
    actionIcon?: string
    onAction?: () => void
    placeholder?: string
    numeric?: boolean
    secure?: boolean
    editable?: boolean
    multiline?: boolean
    alwaysFocused?: boolean // csak design szempont
    allowInputFieldContext?: boolean
    containerStyle?: ViewStyle
    textInputStyle?: ViewStyle & TextStyle
}

const TextInput: React.FC<TextInputProps> = ({
    inputRef,
    type = "primary",
    value,
    setValue,
    icon,
    actionIcon,
    onAction,
    placeholder,
    numeric,
    secure: isSecure = false,
    editable,
    multiline,
    alwaysFocused,
    allowInputFieldContext = true,
    containerStyle,
    textInputStyle
}) => {
    const bottomSheetInternal = useBottomSheetInternal(true);

    const inputFieldContext = allowInputFieldContext ? useInputFieldContext() : null;
    const fieldValue = value || inputFieldContext?.field?.value || "";
    const onChange = inputFieldContext?.field?.onChange;
    const error = inputFieldContext?.fieldState?.error;

    const height = useSharedValue(formTheme.containerHeight);

    const [focused, setFocused] = useState(false);
    const [secure, setSecure] = useState(isSecure);

    const changeSecure = () => setSecure(prevState => !prevState);
    const onFocus = useCallback((args: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setFocused(true);

        if(!bottomSheetInternal) return; // return if not in a bottom sheet
        const { animatedKeyboardState } = bottomSheetInternal;
        const keyboardState = animatedKeyboardState.get();

        animatedKeyboardState.set({
            ...keyboardState,
            target: args.nativeEvent.target
        });
    }, [bottomSheetInternal?.animatedKeyboardState]);
    const onBlur = useCallback((args: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setFocused(false);

        if(!bottomSheetInternal) return; // return if not in a bottom sheet
        const { animatedKeyboardState } = bottomSheetInternal;
        const keyboardState = animatedKeyboardState.get();

        if(keyboardState.target === args.nativeEvent.target) {
            animatedKeyboardState.set({
                ...keyboardState,
                target: undefined
            });
        }
    }, [bottomSheetInternal?.animatedKeyboardState]);

    const updateFieldValue = (value: string) => {
        if(onChange) onChange(value);
        if(setValue) setValue(value);
    };

    const numberOfLines = multiline ? 5 : 1;
    const maxHeight = numberOfLines * formTheme.containerHeight;

    const animatedStyle = useAnimatedStyle(() => ({
        height: withTiming(height.value, { duration: 250 }),
        alignItems: height.value > formTheme.containerHeight ? "flex-start" : "center"
    }));

    const animatedIconStyle = useAnimatedStyle(() => ({
        paddingTop: withTiming(
            height.value > formTheme.containerHeight ? SEPARATOR_SIZES.lightSmall : 0,
            { duration: 250 }
        )
    }));

    const actionIconStyle = useAnimatedStyle(() => ({
        opacity: withTiming(
            fieldValue.length > 0 ? 1 : 0,
            { duration: 200 }
        )
    }));

    const onContentSizeChange = (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
        height.value = Math.min(event.nativeEvent.contentSize.height, maxHeight);
    };

    return (
        <Animated.View
            style={ [
                styles.formFieldContainer,
                animatedStyle,
                type === "primary" && styles.primaryFormFieldContainer,
                containerStyle,
                (focused || alwaysFocused) && styles.activeFormFieldContainer,
                !!error && styles.errorFormFieldContainer
            ] }>
            {
                icon &&
               <Animated.View style={ [styles.formFieldIconContainer, animatedIconStyle] }>
                  <Icon
                     icon={ icon }
                     size={ formTheme.iconSize }
                     color={ styles.textInput.color }
                  />
               </Animated.View>
            }
            <TextInputRN
                ref={ inputRef }
                placeholder={ placeholder }
                style={ [textInputStyle, styles.textInput] }
                placeholderTextColor={ styles.placeholderText.color }
                value={ fieldValue.toString() }
                multiline={ multiline }
                numberOfLines={ numberOfLines }
                keyboardType={ numeric ? "numeric" : "default" }
                secureTextEntry={ secure }
                onChangeText={ updateFieldValue }
                onBlur={ onBlur }
                onFocus={ onFocus }
                editable={ editable }
                onContentSizeChange={ multiline ? onContentSizeChange : undefined }
            />
            {
                isSecure &&
               <View style={ styles.formFieldIconContainer }>
                  <Icon
                     icon={ secure ? ICON_NAMES.eyeOff : ICON_NAMES.eye }
                     size={ hp(3.25) }
                     color={ formTheme.iconColor }
                     onPress={ changeSecure }
                  />
               </View>
            }
            {
                actionIcon &&
               <Animated.View
                  style={ [styles.formFieldIconContainer, animatedIconStyle, multiline && actionIconStyle] }>
                  <Icon
                     icon={ actionIcon }
                     size={ formTheme.iconSize }
                     color={ formTheme.iconColor }
                     onPress={ onAction }
                  />
               </Animated.View>
            }
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    formFieldContainer: {
        minHeight: formTheme.containerHeight,
        flexDirection: "row",
        alignItems: "center",
        overflow: "hidden"
    },
    primaryFormFieldContainer: {
        backgroundColor: formTheme.containerBackgroundColor,
        paddingHorizontal: formTheme.containerPaddingHorizontal,
        borderRadius: formTheme.borderRadius,
        borderWidth: 1,
        borderColor: formTheme.borderColor
    },
    activeFormFieldContainer: {
        borderColor: formTheme.activeColor
    },
    errorFormFieldContainer: {
        borderColor: formTheme.errorColor
    },
    formFieldIconContainer: {
        width: formTheme.iconSize,
        alignItems: "center"
    },
    textInput: {
        flex: 1,
        color: formTheme.valueTextColor,
        fontSize: formTheme.valueTextFontSize,
        // lineHeight: formTheme.valueTextFontSize,
        alignItems: "center",
        justifyContent: "center"
    },
    placeholderText: {
        color: formTheme.placeHolderColor
    }
});

export default TextInput;