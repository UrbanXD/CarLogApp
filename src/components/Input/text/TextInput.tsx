import React, { RefObject, useCallback, useEffect, useRef, useState } from "react";
import {
    BlurEvent,
    FocusEvent,
    KeyboardType,
    NativeSyntheticEvent,
    Platform,
    StyleSheet,
    TextInput as TextInputRN,
    TextInputChangeEventData,
    TextInputContentSizeChangeEventData,
    View
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { ICON_NAMES, SEPARATOR_SIZES } from "../../../constants";
import Icon from "../../Icon.tsx";
import { useInputFieldContext } from "../../../contexts/inputField/InputFieldContext.ts";
import { useBottomSheetInternal } from "@gorhom/bottom-sheet";
import { formTheme } from "../../../ui/form/constants/theme.ts";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { TextStyle, ViewStyle } from "../../../types";

export type TextInputProps = {
    inputRef?: RefObject<TextInputRN | null>
    type?: "primary" | "secondary"
    keyboardType?: KeyboardType
    value?: string
    setValue?: (text: string) => void
    icon?: string
    actionIcon?: string
    onAction?: () => void
    placeholder?: string
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
    keyboardType = "default",
    type = "primary",
    value,
    setValue,
    icon,
    actionIcon,
    onAction,
    placeholder,
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
    const fieldValue = value ?? inputFieldContext?.field?.value ?? "";
    const onChange = inputFieldContext?.field?.onChange;
    let error = inputFieldContext?.fieldState?.error ?? null;
    if(error && error.ref?.name !== inputFieldContext?.field.name) error = null;

    const height = useSharedValue(formTheme.containerHeight);
    const [webMultilineHeight, setWebMultilineHeight] = useState(formTheme.containerHeight);
    const internalInputRef = useRef<TextInputRN | null>(null);

    const [focused, setFocused] = useState(false);
    const [secure, setSecure] = useState(isSecure);

    const changeSecure = () => setSecure(prevState => !prevState);
    const onFocus = useCallback((event: FocusEvent) => {
        setFocused(true);

        if(!bottomSheetInternal) return; // return if not in a bottom sheet
        const { animatedKeyboardState } = bottomSheetInternal;
        const keyboardState = animatedKeyboardState.get();

        animatedKeyboardState.set({
            ...keyboardState,
            target: event.nativeEvent.target
        });
    }, [bottomSheetInternal?.animatedKeyboardState]);

    const onBlur = useCallback((event: BlurEvent) => {
        setFocused(false);

        if(!bottomSheetInternal) return; // return if not in a bottom sheet
        const { animatedKeyboardState } = bottomSheetInternal;
        const keyboardState = animatedKeyboardState.get();

        if(keyboardState.target === event.nativeEvent.target) {
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

    const numberOfLines = multiline && Platform.OS !== "web" ? 5 : 1;
    // Let web notes grow to four field heights before the textarea starts scrolling.
    // Keep the existing native limit and mobile behavior unchanged.
    const maxHeight = multiline
                      ? 3 * formTheme.containerHeight
                      : formTheme.containerHeight;

    const measureWebMultilineInput = useCallback((inputOverride?: any) => {
        if(Platform.OS !== "web" || !multiline) return;

        requestAnimationFrame(() => {
            const input = inputOverride ?? (inputRef?.current ?? internalInputRef.current) as any;
            if(!input?.style || typeof input.scrollHeight !== "number") return;

            const borderHeight = type === "primary" ? 2 : 0;
            const lineHeight = formTheme.valueTextFontSize * 1.25;

            // Measure with natural height so a previously expanded textarea can shrink too.
            input.style.height = "auto";
            input.style.paddingTop = "0px";
            const contentHeight = input.scrollHeight;
            const nextHeight = Math.max(
                formTheme.containerHeight,
                Math.min(contentHeight + borderHeight, maxHeight)
            );

            // Keep the placeholder and a single entered line centered; multiline content starts at the top.
            const isSingleLine = !input.value?.includes("\n") && contentHeight <= lineHeight * 1.5;
            input.style.paddingTop = isSingleLine
                                     ? `${ Math.max(0, (formTheme.containerHeight - borderHeight - lineHeight) / 2) }px`
                                     : "0px";
            input.style.height = "100%";

            height.value = nextHeight;
            setWebMultilineHeight(nextHeight);
        });
    }, [height, inputRef, maxHeight, multiline, type]);

    useEffect(() => {
        measureWebMultilineInput();
    }, [fieldValue, measureWebMultilineInput]);

    const animatedStyle = useAnimatedStyle(() => ({
        height: withTiming(height.value, { duration: 250 }),
        alignItems: height.value > formTheme.containerHeight ? "flex-start" : "center"
    }));

    const containerSizeStyle = Platform.OS === "web" && multiline
                               ? {
            height: webMultilineHeight,
            alignItems: webMultilineHeight > formTheme.containerHeight ? "flex-start" as const : "center" as const
        }
                               : animatedStyle;

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
        const nextHeight = Math.max(
            formTheme.containerHeight,
            Math.min(event.nativeEvent.contentSize.height, maxHeight)
        );
        height.value = nextHeight;
        if(Platform.OS === "web") setWebMultilineHeight(nextHeight);
    };

    const onWebMultilineChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        if(Platform.OS !== "web" || !multiline) return;

        const webEvent = event as any;
        measureWebMultilineInput(webEvent.currentTarget ?? webEvent.target);
    };

    const multilineAlignmentStyle = multiline && Platform.OS !== "web"
                                    ? {
            textAlignVertical: fieldValue.toString().length === 0
                               ? "center" as const
                               : "top" as const
        }
                                    : undefined;

    return (
        <Animated.View
            style={ [
                styles.formFieldContainer,
                containerSizeStyle,
                type === "primary" && styles.primaryFormFieldContainer,
                containerStyle,
                (focused || alwaysFocused) && styles.activeFormFieldContainer,
                !!error && styles.errorFormFieldContainer,
                Platform.OS === "web" && styles.webFormFieldContainer,
                Platform.OS === "web" && multiline && styles.webMultilineFormFieldContainer
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
                ref={ inputRef ?? internalInputRef }
                placeholder={ placeholder }
                style={ [
                    textInputStyle,
                    styles.textInput,
                    multiline && styles.multilineTextInput,
                    Platform.OS === "web" && styles.webTextInput,
                    Platform.OS === "web" && multiline && styles.webMultilineTextInput,
                    multilineAlignmentStyle
                ] }
                placeholderTextColor={ styles.placeholderText.color }
                value={ fieldValue.toString() }
                multiline={ multiline }
                numberOfLines={ numberOfLines }
                keyboardType={ keyboardType }
                secureTextEntry={ secure }
                onChange={ Platform.OS === "web" && multiline ? onWebMultilineChange : undefined }
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
    webFormFieldContainer: {
        maxWidth: "100%",
        minWidth: 0,
        alignSelf: "stretch",
        flexBasis: 0,
        flexGrow: 1,
        flexShrink: 1
    },
    webMultilineFormFieldContainer: {
        flexBasis: "auto",
        flexGrow: 0,
        flexShrink: 0
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
        minWidth: 0,
        color: formTheme.valueTextColor,
        fontSize: formTheme.valueTextFontSize,
        alignItems: "center"
    },
    multilineTextInput: {
        height: "100%",
        lineHeight: formTheme.valueTextFontSize * 1.25,
        textAlignVertical: "top"
    },
    webTextInput: {
        width: 0,
        minWidth: 0,
        maxWidth: "100%",
        flexBasis: 0,
        flexGrow: 1,
        flexShrink: 1,
        boxSizing: "border-box",
        outlineStyle: "none",
        outlineWidth: 0,
        outlineColor: "transparent",
        boxShadow: "none"
    } as any,
    webMultilineTextInput: {
        overflowY: "auto"
    } as any,
    placeholderText: {
        color: formTheme.placeHolderColor
    }
});

export default TextInput;
