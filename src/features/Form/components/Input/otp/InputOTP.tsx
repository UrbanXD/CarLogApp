import React, { useEffect, useRef, useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { theme } from "../../../../Shared/constants/theme";
import { FONT_SIZES, SEPARATOR_SIZES } from "../../../../Shared/constants/constants";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

interface InputOTPProps {
    title?: string
    numberOfDigits?: number
}

const InputOTP: React.FC<InputOTPProps> = ({
    title,
    numberOfDigits = 6,
}) => {
    const hiddenInputRef = useRef<TextInput>(null);
    const [code, setCode] = useState<string>("");
    const [digits, setDigits] = useState<Array<string>>(new Array<string>(numberOfDigits).fill(""));

    const onChangeText = (value: string) => {
        value = value.replace(/[^0-9]/g, "");

        setCode(prevCode => {
            setDigits(prevDigits => {
                const newDigits = [...prevDigits];
                const maxLength = newDigits.length;

                // Tisztítsuk meg azokat a helyeket, ahol már nincs érték
                for (let i = value.length; i < maxLength; i++) {
                    newDigits[i] = "";
                }

                // Frissítsük az aktuális értékeket
                for (let i = 0; i < value.length && i < maxLength; i++) {
                    newDigits[i] = value[i];
                }

                return newDigits;
            });

            return value})
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

    const colorOfFocusedDigit = useSharedValue(0);
    const focusedDigitStyle = useAnimatedStyle(() => {
        return {
            borderColor:
                interpolateColor(
                    colorOfFocusedDigit.value,
                    [0, 1],
                    [theme.colors.gray3, theme.colors.fuelYellow] // Közvetlen színek használata
                )
        };
    });

    const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

    return (
        <View style={ styles.container }>
            {
                digits.map(
                    (value, index) =>
                        <AnimatedPressable
                            key={ index }
                            onPress={ () => hiddenInputRef.current?.focus() }
                            style={[
                                styles.codeContainer,
                                code.length === index && focusedDigitStyle,
                                code.length === numberOfDigits && styles.focusedCodeContainer
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
                maxLength={ numberOfDigits }
                keyboardType="number-pad"
                enterKeyHint="next"
                autoFocus
                style={ styles.hiddenInput }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
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
    codeContainer: {
        width: wp(100 / 6) - 2 * SEPARATOR_SIZES.lightSmall,
        borderBottomWidth: 3.5,
        borderColor: theme.colors.gray3,
    },
    focusedCodeContainer: {
        borderColor: theme.colors.fuelYellow,
    },
    codeText: {
        height: "100%",
        textAlignVertical: "bottom",
        textAlign: "center",
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.large,
        color: theme.colors.white,
    }
});

export default InputOTP;