import React, { useEffect, useState } from "react";
import { useMultiStepForm } from "../../contexts/multiStepForm/MultiStepFormContext.ts";
import { Keyboard, StyleSheet, View } from "react-native";
import Button from "../Button/Button.ts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

const MultiStepFormButtons: React.FC = () => {
    const { top } = useSafeAreaInsets();
    const [keyboardShowing, setKeyboardShowing] = useState(false);

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => setKeyboardShowing(true));
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => setKeyboardShowing(false));

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const {
        isFirstCount,
        isFirstStep,
        isLastStep,
        next,
        back
    } = useMultiStepForm();

    return (
        <KeyboardAvoidingView style={ { height: (keyboardShowing && top !== 0) ? 0 : undefined } }>
            <Button.Row>
                <View style={ styles.backButtonContainer }>
                    {
                        !isFirstStep &&
                       <Button.MultistepFormBack onPress={ back }/>
                    }
                </View>
                <View style={ styles.nextButtonContainer }>
                    {
                        ((isFirstCount && isFirstStep) || !isFirstStep) &&
                       <Button.MultistepFormNext onPress={ next } isLastStep={ isLastStep }/>
                    }
                </View>
            </Button.Row>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    backButtonContainer: {
        flex: 0.175
    },
    nextButtonContainer: {
        flex: 0.825
    }
});

export default MultiStepFormButtons;