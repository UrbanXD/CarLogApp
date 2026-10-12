import React from "react";
import { useMultiStepForm } from "../../contexts/multiStepForm/MultiStepFormContext.ts";
import { Platform, StyleSheet, View } from "react-native";
import Button from "../Button/Button.ts";

const MultiStepFormButtons: React.FC = () => {
    const {
        isFirstCount,
        isFirstStep,
        isLastStep,
        next,
        back
    } = useMultiStepForm();

    return (
        <Button.Row style={ Platform.OS === "web" ? styles.webRow : undefined }>
            <View style={ Platform.OS === "web" ? styles.webBackButtonContainer : styles.backButtonContainer }>
                {
                    !isFirstStep &&
                   <Button.MultistepFormBack onPress={ back }/>
                }
            </View>
            <View style={ Platform.OS === "web" ? styles.webNextButtonContainer : styles.nextButtonContainer }>
                {
                    ((isFirstCount && isFirstStep) || !isFirstStep) &&
                   <Button.MultistepFormNext onPress={ next } isLastStep={ isLastStep }/>
                }
            </View>
        </Button.Row>
    );
};

const styles = StyleSheet.create({
    backButtonContainer: {
        flex: 0.175
    },
    nextButtonContainer: {
        flex: 0.825
    },
    webRow: {
        width: "100%",
        minWidth: 0,
        justifyContent: "space-between",
        alignSelf: "stretch"
    },
    webBackButtonContainer: {
        width: 60,
        flexGrow: 0,
        flexShrink: 0,
        alignItems: "flex-start"
    },
    webNextButtonContainer: {
        width: "58%",
        maxWidth: 520,
        minWidth: 0,
        flexGrow: 0,
        flexShrink: 1,
        marginLeft: "auto"
    }
});

export default MultiStepFormButtons;
