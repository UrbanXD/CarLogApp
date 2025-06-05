import React, { useEffect, useRef, useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Colors } from "../../../../../constants/colors";
import { FONT_SIZES, SEPARATOR_SIZES } from "../../../../../constants/constants";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import Button from "../../../../../components/Button/Button";

interface InputOTPProps {
    numberOfDigits?: number
    onSubmit: (token: string) => Promise<void>
}

const InputOTP: React.FC<InputOTPProps> = ({
    numberOfDigits = 6,
    onSubmit
}) => {
    const hiddenInputRef = useRef<TextInput>(null);

    const [code, setCode] = useState<string>("");
    const [digits, setDigits] = useState<Array<string>>(new Array<string>(numberOfDigits).fill(""));
    const [focused, setFocused] = useState<boolean>(false);

    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);

    const onChangeText = (value: string) => {
        value = value.replace(/[^0-9]/g, "");

        setCode(_ => {
            setDigits(prevDigits => {
                const newDigits = [...prevDigits];

                // a value hossza utan minden legyen ""
                for (let i = value.length; i < newDigits.length; i++) {
                    newDigits[i] = "";
                }

                // az input alapjan allit suk be
                for (let i = 0; i < value.length && i < newDigits.length; i++) {
                    newDigits[i] = value[i];
                }

                return newDigits;
            });

            return value
        })
    }

    // androidon ha a mobil back gombjaval zarom be a billenytuzetet, akkor focus marad az inputon
    useEffect(() => {
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            Keyboard.dismiss();
            hiddenInputRef.current?.blur();
        });
        return () => {
            hideSubscription.remove();
        };
    }, []);

    useEffect(() => {
        colorOfFocusedDigit.value = withRepeat(
            withTiming(1, { duration: 850 }),
            -1,
            true
        );
    }, []);

    useEffect(() => {
        setTimeout(() => hiddenInputRef.current?.focus(), 0); // auto focus
    }, [hiddenInputRef]);

    const styles= useStyles(numberOfDigits);

    const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

    const colorOfFocusedDigit = useSharedValue(0);
    const focusedDigitStyle = useAnimatedStyle(() => {
        return {
            borderColor:
                interpolateColor(
                    colorOfFocusedDigit.value,
                    [0, 1],
                    [styles.codeInputContainer.borderColor, styles.focusedCodeInputContainer.borderColor]
                )
        };
    });

    return (
        <View style={ styles.container }>
            <View style={ styles.codeContainer }>
                {
                    digits.map(
                        (value, index) =>
                            <AnimatedPressable
                                key={ index }
                                onPress={ () => hiddenInputRef.current?.focus() }
                                style={[
                                    styles.codeInputContainer,
                                    code.length === index && (focused ? focusedDigitStyle : styles.focusedCodeInputContainer),
                                    code.length === numberOfDigits && styles.focusedCodeInputContainer
                                ]}
                            >
                                <Text style={ styles.codeText }>
                                    { value }
                                </Text>
                            </AnimatedPressable>
                    )
                }
                <TextInput
                    ref={ hiddenInputRef }
                    value={ code }
                    onChangeText={ onChangeText }
                    onFocus={ onFocus }
                    onBlur={ onBlur }
                    maxLength={ numberOfDigits }
                    keyboardType="number-pad"
                    enterKeyHint="next"
                    style={ styles.hiddenInput }
                />
            </View>
            <Button.Text
                text="Tovább"
                width={ wp(75) }
                disabled={ code.length !== numberOfDigits }
                onPress={ () => onSubmit(code) }
                loadingIndicator
            />
        </View>
    )
}

const useStyles = (numberOfDigits: number) =>
    StyleSheet.create({
        container: {
            gap: SEPARATOR_SIZES.medium
        },
        codeContainer: {
            flexDirection: "row",
            gap: SEPARATOR_SIZES.lightSmall,
            justifyContent: "center",
            width: "100%",
            height: hp(7.5),
        },
        hiddenInput: {
            position: "absolute",
            width: 1,
            height: 1,
            opacity: 0
        },
        codeInputContainer: {
            width: wp(100 / numberOfDigits) - 2 * SEPARATOR_SIZES.lightSmall,
            borderBottomWidth: 3.5,
            borderColor: Colors.gray3,
        },
        focusedCodeInputContainer: {
            borderColor: Colors.fuelYellow,
        },
        codeText: {
            height: "100%",
            textAlignVertical: "bottom",
            textAlign: "center",
            fontFamily: "Gilroy-Heavy",
            fontSize: FONT_SIZES.h1,
            color: Colors.white,
        }
    });

export default InputOTP;